import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { cn } from "../../lib/utils";

const ICON_MAP: Record<string, string> = {
  Server: "◉",
  Activity: "▣",
  Zap: "⚡",
  Database: "◈",
  Table: "⊞",
  HardDrive: "⬡",
  Folder: "⊟",
  Globe: "◇",
  Scale: "⚖",
  ArrowRightLeft: "↔",
  Shield: "◆",
  Key: "🔑",
};

export const InfrastructureNode = memo(function InfrastructureNode({
  data,
  selected,
}: NodeProps) {
  const icon = ICON_MAP[data?.icon as string] ?? "●";
  const label = (data?.label as string) ?? "Unknown";
  const component = (data?.component as string) ?? "unknown";

  return (
    <div
      className={cn(
        "min-w-[140px] rounded-lg border-2 bg-card px-4 py-3 shadow-lg transition-all",
        selected
          ? "border-primary shadow-primary/20"
          : "border-border hover:border-primary/50"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-primary">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{label}</p>
          <p className="text-xs text-muted-foreground truncate">{component}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-2 !h-2" />
    </div>
  );
});
