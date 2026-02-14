import type { NodeType, Provider } from "../../types/infrastructure";

export interface ComponentDefinition {
  id: string;
  label: string;
  description: string;
  type: NodeType;
  provider: Provider;
  component: string;
  icon: string;
  category: string;
  defaultProperties: Record<string, unknown>;
}

export const COMPONENT_LIBRARY: ComponentDefinition[] = [
  // Compute
  {
    id: "ec2",
    label: "EC2 Instance",
    description: "Virtual server for running applications",
    type: "compute",
    provider: "aws",
    component: "ec2",
    icon: "Server",
    category: "Compute",
    defaultProperties: {
      instanceType: "t3.medium",
      ami: "amazon-linux-2",
    },
  },
  {
    id: "asg",
    label: "Auto Scaling Group",
    description: "Automatically scale EC2 instances based on demand",
    type: "compute",
    provider: "aws",
    component: "asg",
    icon: "Activity",
    category: "Compute",
    defaultProperties: {
      minSize: 2,
      maxSize: 10,
      desiredCapacity: 2,
      instanceType: "t3.medium",
    },
  },
  {
    id: "lambda",
    label: "Lambda Function",
    description: "Serverless compute for event-driven workloads",
    type: "compute",
    provider: "aws",
    component: "lambda",
    icon: "Zap",
    category: "Compute",
    defaultProperties: {
      runtime: "nodejs20.x",
      memory: 512,
      timeout: 30,
    },
  },
  // Database
  {
    id: "rds",
    label: "RDS Database",
    description: "Managed relational database (PostgreSQL, MySQL)",
    type: "database",
    provider: "aws",
    component: "rds",
    icon: "Database",
    category: "Database",
    defaultProperties: {
      engine: "postgres",
      instanceClass: "db.t3.medium",
      allocatedStorage: 100,
      multiAz: true,
    },
  },
  {
    id: "dynamodb",
    label: "DynamoDB",
    description: "Serverless NoSQL database",
    type: "database",
    provider: "aws",
    component: "dynamodb",
    icon: "Table",
    category: "Database",
    defaultProperties: {
      billingMode: "PAY_PER_REQUEST",
    },
  },
  // Storage
  {
    id: "s3",
    label: "S3 Bucket",
    description: "Object storage for files and static assets",
    type: "storage",
    provider: "aws",
    component: "s3",
    icon: "HardDrive",
    category: "Storage",
    defaultProperties: {
      versioning: true,
      encryption: true,
    },
  },
  {
    id: "efs",
    label: "EFS",
    description: "Elastic file system for shared storage",
    type: "storage",
    provider: "aws",
    component: "efs",
    icon: "Folder",
    category: "Storage",
    defaultProperties: {
      encrypted: true,
    },
  },
  // Network
  {
    id: "vpc",
    label: "VPC",
    description: "Virtual private cloud with subnets",
    type: "network",
    provider: "aws",
    component: "vpc",
    icon: "Globe",
    category: "Network",
    defaultProperties: {
      cidr: "10.0.0.0/16",
      azCount: 3,
      publicSubnets: true,
      privateSubnets: true,
    },
  },
  {
    id: "alb",
    label: "Application Load Balancer",
    description: "Distribute traffic across targets",
    type: "network",
    provider: "aws",
    component: "alb",
    icon: "Scale",
    category: "Network",
    defaultProperties: {
      scheme: "internet-facing",
      http: true,
      https: true,
    },
  },
  {
    id: "nat",
    label: "NAT Gateway",
    description: "Allow private subnets to access internet",
    type: "network",
    provider: "aws",
    component: "nat",
    icon: "ArrowRightLeft",
    category: "Network",
    defaultProperties: {},
  },
  // Security
  {
    id: "security-group",
    label: "Security Group",
    description: "Firewall rules for network traffic",
    type: "security",
    provider: "aws",
    component: "security_group",
    icon: "Shield",
    category: "Security",
    defaultProperties: {
      ingress: [],
      egress: [{ protocol: "all", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }],
    },
  },
  {
    id: "iam-role",
    label: "IAM Role",
    description: "AWS identity with permissions",
    type: "security",
    provider: "aws",
    component: "iam_role",
    icon: "Key",
    category: "Security",
    defaultProperties: {},
  },
];

export const COMPONENT_CATEGORIES = [
  "Compute",
  "Database",
  "Storage",
  "Network",
  "Security",
] as const;
