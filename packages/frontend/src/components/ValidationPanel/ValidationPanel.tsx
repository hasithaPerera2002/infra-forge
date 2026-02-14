import { useMemo } from "react";
import { useCanvasState } from "../../hooks/useCanvasState";
import { SecurityIssues } from "./SecurityIssues";
import { AlertTriangle, CheckCircle } from "lucide-react";

export function ValidationPanel() {
  const { nodes, terraformCode } = useCanvasState();

  const validation = useMemo(() => {
    const issues: { id: string; severity: "info" | "warning" | "critical"; message: string; resource?: string }[] = [];

    if (nodes.length === 0) {
      return { issues: [], hasVpc: false, hasCompute: false };
    }

    const hasVpc = nodes.some((n) => (n.data?.component as string) === "vpc");
    const hasCompute = nodes.some((n) =>
      ["ec2", "asg", "lambda"].includes(n.data?.component as string)
    );

    if (!hasVpc && hasCompute) {
      issues.push({
        id: "no-vpc",
        severity: "warning",
        message: "Consider adding a VPC for network isolation. Compute resources work best inside a VPC.",
      });
    }

    if (hasCompute && !nodes.some((n) => (n.data?.component as string) === "alb")) {
      issues.push({
        id: "no-alb",
        severity: "info",
        message: "For production web applications, add an Application Load Balancer for traffic distribution.",
      });
    }

    return { issues, hasVpc, hasCompute };
  }, [nodes]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-foreground">Validation</h2>
      {terraformCode ? (
        <div className="flex items-center gap-2 text-sm text-primary">
          <CheckCircle className="h-4 w-4" />
          Terraform generated successfully
        </div>
      ) : nodes.length > 0 ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          Click Generate Terraform to validate
        </div>
      ) : null}
      <SecurityIssues issues={validation.issues} />
    </div>
  );
}
