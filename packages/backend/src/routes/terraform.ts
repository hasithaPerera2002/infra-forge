import { Router, Request, Response } from "express";
import { TerraformGenerator } from "../services/terraform/generator.js";

export const terraformRouter = Router();

interface NodeConfig {
  id: string;
  type: string;
  provider: string;
  component: string;
  position: Record<string, number>;
  properties: Record<string, unknown>;
}

interface GenerateRequest {
  project_id: string;
  infrastructure: {
    nodes: NodeConfig[];
    connections: Array<{ id: string; source: string; target: string; type: string }>;
  };
  user_answers?: Record<string, unknown>;
}

terraformRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    const body = req.body as GenerateRequest;
    const generator = new TerraformGenerator();
    const result = await generator.generate({
      nodes: body.infrastructure.nodes,
      connections: body.infrastructure.connections,
      requirements: body.user_answers ?? {},
    });
    res.json(result);
  } catch (err) {
    console.error("Terraform generation error:", err);
    res.status(500).json({
      detail: err instanceof Error ? err.message : "Failed to generate Terraform",
    });
  }
});
