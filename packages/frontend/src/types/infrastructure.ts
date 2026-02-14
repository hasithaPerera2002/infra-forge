export type NodeType = "compute" | "database" | "storage" | "network" | "security";
export type Provider = "aws" | "gcp" | "azure";

export interface InfrastructureNode {
  id: string;
  type: NodeType;
  provider: Provider;
  component: string;
  position: { x: number; y: number };
  properties: Record<string, unknown>;
  aiSuggestions?: AISuggestion[];
  validationIssues?: ValidationIssue[];
  estimatedCost?: CostEstimate;
  data?: {
    label: string;
    description?: string;
    icon?: string;
    component: string;
  };
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: "network" | "dependency" | "data-flow";
  properties?: {
    protocol?: string;
    port?: number;
    encrypted?: boolean;
  };
}

export interface ProjectRequirements {
  environment: "development" | "staging" | "production";
  traffic: "low" | "medium" | "high";
  budget?: number;
  highAvailability: boolean;
  multiRegion: boolean;
  compliance?: ("hipaa" | "soc2" | "pci-dss" | "gdpr")[];
}

export interface InfrastructureProject {
  id: string;
  name: string;
  description?: string;
  nodes: InfrastructureNode[];
  connections: Connection[];
  requirements: ProjectRequirements;
  generatedTerraform?: TerraformCode;
  estimatedMonthlyCost?: number;
}

export interface AISuggestion {
  type: "security" | "cost" | "best-practice" | "architecture";
  severity: "info" | "warning" | "critical";
  message: string;
  autoFix?: () => void;
}

export interface ValidationIssue {
  id: string;
  resourceId: string;
  severity: "info" | "warning" | "critical";
  message: string;
  remediation?: string;
}

export interface CostEstimate {
  monthly: number;
  breakdown: Record<string, number>;
  currency: string;
}
