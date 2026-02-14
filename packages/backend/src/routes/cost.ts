import { Router, Request, Response } from "express";
import { CostCalculator } from "../services/cost-estimator/calculator.js";

export const costRouter = Router();

interface EstimateRequest {
  infrastructure: {
    nodes: Array<{
      id: string;
      component: string;
      properties?: Record<string, unknown>;
    }>;
  };
}

costRouter.post("/estimate", async (req: Request, res: Response) => {
  try {
    const body = req.body as EstimateRequest;
    const calculator = new CostCalculator();
    const result = calculator.calculate(body.infrastructure.nodes);
    res.json(result);
  } catch (err) {
    console.error("Cost estimation error:", err);
    res.status(500).json({
      detail: err instanceof Error ? err.message : "Failed to estimate cost",
    });
  }
});
