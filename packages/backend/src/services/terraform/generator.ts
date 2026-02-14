import * as templates from "./templates/aws/index.js";
import { CostCalculator } from "../cost-estimator/calculator.js";

interface Node {
  id: string;
  component: string;
  properties?: Record<string, unknown>;
}

interface Connection {
  id: string;
  source: string;
  target: string;
  type: string;
}

export class TerraformGenerator {
  private costCalculator = new CostCalculator();

  async generate(options: {
    nodes: Node[];
    connections: Connection[];
    requirements: Record<string, unknown>;
  }): Promise<{
    terraform: {
      modules: Array<{ name: string; path: string; content: string }>;
      variables: string;
      outputs: string;
      mainTf: string;
      backendTf?: string;
    };
    estimated_cost?: number;
  }> {
    const { nodes, requirements } = options;
    const projectName = "infraforge";
    const environment = (requirements.environment as string) ?? "production";

    const modules: Array<{ name: string; path: string; content: string }> = [];

    const hasVpc = nodes.some((n) => n.component === "vpc");
    const hasAlb = nodes.some((n) => n.component === "alb");
    const hasAsg = nodes.some((n) => n.component === "asg");
    const hasEc2 = nodes.some((n) => n.component === "ec2");
    const hasRds = nodes.some((n) => n.component === "rds");
    const hasS3 = nodes.some((n) => n.component === "s3");

    if (hasVpc || hasEc2 || hasAsg || hasRds) {
      const vpcNode = nodes.find((n) => n.component === "vpc");
      const props = vpcNode?.properties ?? {};
      modules.push({
        name: "vpc",
        path: "modules/vpc",
        content: templates.vpcTemplate({
          projectName,
          environment,
          cidr: (props.cidr as string) ?? "10.0.0.0/16",
          azCount: (props.azCount as number) ?? 3,
        }),
      });
    }

    if (hasAlb && (hasAsg || hasEc2)) {
      modules.push({
        name: "alb",
        path: "modules/alb",
        content: templates.albTemplate({ projectName, environment }),
      });
    }

    if (hasAsg || hasEc2) {
      const computeNode = nodes.find((n) => n.component === "asg" || n.component === "ec2");
      const props = computeNode?.properties ?? {};
      const isAsg = hasAsg;
      modules.push({
        name: "compute",
        path: "modules/compute",
        content: templates.ec2Template({
          projectName,
          environment,
          minSize: isAsg ? ((props.minSize as number) ?? 2) : 1,
          maxSize: isAsg ? ((props.maxSize as number) ?? 10) : 1,
          instanceType: (props.instanceType as string) ?? "t3.medium",
        }),
      });
    }

    if (hasRds) {
      const rdsNode = nodes.find((n) => n.component === "rds");
      const props = rdsNode?.properties ?? {};
      modules.push({
        name: "database",
        path: "modules/database",
        content: templates.rdsTemplate({
          projectName,
          environment,
          engine: (props.engine as string) ?? "postgres",
          instanceClass: (props.instanceClass as string) ?? "db.t3.medium",
          allocatedStorage: (props.allocatedStorage as number) ?? 100,
          multiAz: (props.multiAz as boolean) ?? true,
        }),
      });
    }

    if (hasS3) {
      const s3Node = nodes.find((n) => n.component === "s3");
      const props = s3Node?.properties ?? {};
      modules.push({
        name: "storage",
        path: "modules/storage",
        content: templates.s3Template({
          projectName,
          environment,
          versioning: (props.versioning as boolean) ?? true,
          encryption: (props.encryption as boolean) ?? true,
        }),
      });
    }

    const modOrder: typeof modules = [];
    for (const m of modules) {
      if (m.name === "vpc") modOrder.push(m);
    }
    for (const m of modules) {
      if (m.name === "alb") modOrder.push(m);
    }
    for (const m of modules) {
      if (m.name === "compute") modOrder.push(m);
    }
    for (const m of modules) {
      if (!["vpc", "alb", "compute"].includes(m.name)) modOrder.push(m);
    }

    const mainTf = this.buildMainTf(modOrder);
    const variablesTf = this.buildVariables();
    const outputsTf = this.buildOutputs(modOrder);
    const backendTf = this.buildBackend(projectName);

    const costResult = this.costCalculator.calculate(nodes);

    return {
      terraform: {
        modules,
        variables: variablesTf,
        outputs: outputsTf,
        mainTf,
        backendTf,
      },
      estimated_cost: costResult.estimated_monthly,
    };
  }

  private buildMainTf(
    modules: Array<{ name: string }>
  ): string {
    const header = `# InfraForge Generated - Production-Ready Infrastructure
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = local.common_tags
  }
}

locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
    CreatedBy   = "InfraForge"
  }
}
`;

    const modBlocks: string[] = [];

    for (const mod of modules) {
      if (mod.name === "vpc") {
        modBlocks.push(`
module "vpc" {
  source = "./modules/vpc"
  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
  az_count     = var.az_count
}
`);
      } else if (mod.name === "alb") {
        modBlocks.push(`
module "alb" {
  source = "./modules/alb"
  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
}
`);
      } else if (mod.name === "compute") {
        modBlocks.push(`
module "compute" {
  source = "./modules/compute"
  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  target_group_arn      = module.alb.target_group_arn
  alb_security_group_id = module.alb.alb_sg_id
}
`);
      } else if (mod.name === "database") {
        modBlocks.push(`
module "database" {
  source = "./modules/database"
  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
}
`);
      } else if (mod.name === "storage") {
        modBlocks.push(`
module "storage" {
  source = "./modules/storage"
  project_name = var.project_name
  environment  = var.environment
}
`);
      }
    }

    return header + modBlocks.join("\n");
  }

  private buildVariables(): string {
    return `variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Project name"
  default     = "infraforge"
}

variable "environment" {
  type        = string
  description = "Environment (dev/staging/production)"
  default     = "production"
}

variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block"
  default     = "10.0.0.0/16"
}

variable "az_count" {
  type        = number
  description = "Number of availability zones"
  default     = 3
}
`;
  }

  private buildOutputs(modules: Array<{ name: string }>): string {
    const outputs: string[] = [];
    if (modules.some((m) => m.name === "vpc")) {
      outputs.push(
        'output "vpc_id" { value = module.vpc.vpc_id }',
        'output "private_subnet_ids" { value = module.vpc.private_subnet_ids }'
      );
    }
    if (modules.some((m) => m.name === "alb")) {
      outputs.push('output "alb_dns_name" { value = module.alb.alb_dns_name }');
    }
    return outputs.join("\n\n");
  }

  private buildBackend(projectName: string): string {
    return `terraform {
  backend "s3" {
    bucket         = "${projectName}-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "${projectName}-terraform-locks"
    encrypt        = true
  }
}
`;
  }
}
