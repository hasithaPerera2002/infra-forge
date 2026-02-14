const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export interface GenerateTerraformRequest {
  project_id: string;
  infrastructure: {
    nodes: Array<{
      id: string;
      type: string;
      provider: string;
      component: string;
      position: { x: number; y: number };
      properties: Record<string, unknown>;
    }>;
    connections: Array<{
      id: string;
      source: string;
      target: string;
      type: string;
    }>;
  };
  user_answers?: Record<string, unknown>;
}

export interface GenerateTerraformResponse {
  terraform: {
    modules: Array<{ name: string; path: string; content: string }>;
    variables: string;
    outputs: string;
    mainTf: string;
    backendTf?: string;
  };
  estimated_cost?: number;
  validation?: {
    issues: Array<{ severity: string; message: string; resource?: string }>;
  };
}

export async function generateTerraform(
  request: GenerateTerraformRequest
): Promise<GenerateTerraformResponse> {
  const response = await fetch(`${API_BASE}/terraform/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? "Failed to generate Terraform");
  }
  return response.json();
}

export async function estimateCost(
  infrastructure: GenerateTerraformRequest["infrastructure"]
): Promise<{ estimated_monthly: number; breakdown: Record<string, number> }> {
  const response = await fetch(`${API_BASE}/cost/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ infrastructure }),
  });
  if (!response.ok) throw new Error("Failed to estimate cost");
  return response.json();
}
