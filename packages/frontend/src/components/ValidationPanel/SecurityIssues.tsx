import { ShieldAlert } from "lucide-react";

interface SecurityIssue {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  resource?: string;
}

interface SecurityIssuesProps {
  issues: SecurityIssue[];
}

export function SecurityIssues({ issues }: SecurityIssuesProps) {
  if (issues.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-primary/10 p-3 text-sm text-primary">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span>No security issues found</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className={`rounded-md p-3 text-sm ${
            issue.severity === "critical"
              ? "bg-destructive/10 text-destructive"
              : issue.severity === "warning"
              ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{issue.message}</p>
              {issue.resource && (
                <p className="mt-1 text-xs opacity-80">Resource: {issue.resource}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
