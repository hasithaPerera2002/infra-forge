import { useCanvasState } from "../../hooks/useCanvasState";
import { DollarSign, TrendingUp } from "lucide-react";

export function CostEstimate() {
  const { estimatedCost, nodes } = useCanvasState();

  if (nodes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="h-5 w-5" />
          <span className="text-sm">Add components to see cost estimate</span>
        </div>
      </div>
    );
  }

  if (estimatedCost === null) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="h-5 w-5" />
          <span className="text-sm">Generate Terraform to see cost estimate</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Estimated Monthly Cost</span>
        </div>
        <span className="text-2xl font-bold text-primary">
          ${estimatedCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        <TrendingUp className="inline h-3 w-3" /> Based on on-demand pricing in us-east-1
      </p>
    </div>
  );
}
