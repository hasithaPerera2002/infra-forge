import { useCallback } from "react";
import { useCanvasState } from "./useCanvasState";
import { generateTerraform } from "../lib/api";

export function useTerraformGeneration() {
  const {
    toInfrastructureGraph,
    requirements,
    setTerraformCode,
    setEstimatedCost,
    setLoadingTerraform,
  } = useCanvasState();

  const generate = useCallback(async () => {
    const { nodes, connections } = toInfrastructureGraph();
    if (nodes.length === 0) {
      throw new Error("Add at least one component to generate Terraform");
    }

    setLoadingTerraform(true);
    try {
      const response = await generateTerraform({
        project_id: "default",
        infrastructure: {
          nodes: nodes.map((n) => ({
            id: n.id,
            type: n.type,
            provider: n.provider,
            component: n.component,
            position: n.position,
            properties: n.properties,
          })),
          connections,
        },
        user_answers: requirements as unknown as Record<string, unknown>,
      });

      setTerraformCode(response.terraform);
      setEstimatedCost(response.estimated_cost ?? null);
      return response;
    } finally {
      setLoadingTerraform(false);
    }
  }, [
    toInfrastructureGraph,
    requirements,
    setTerraformCode,
    setEstimatedCost,
    setLoadingTerraform,
  ]);

  return { generate };
}
