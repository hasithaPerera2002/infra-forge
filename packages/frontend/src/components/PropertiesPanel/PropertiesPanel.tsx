import { useCanvasState } from "../../hooks/useCanvasState";
import { ConfigForm } from "./ConfigForm";
import { AIQuestions } from "./AIQuestions";

export function PropertiesPanel() {
  const { selectedNodeId, nodes } = useCanvasState();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNodeId) {
    return (
      <div className="flex h-full flex-col border-l border-border bg-card p-4">
        <h2 className="mb-4 font-semibold text-foreground">Properties</h2>
        <p className="text-sm text-muted-foreground">
          Select a component on the canvas to edit its properties.
        </p>
      </div>
    );
  }

  if (!selectedNode) return null;

  return (
    <div className="flex h-full w-80 flex-col border-l border-border bg-card">
      <div className="border-b border-border p-4">
        <h2 className="font-semibold text-foreground">Properties</h2>
        <p className="mt-1 text-sm text-muted-foreground">{selectedNode.data?.label as string}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ConfigForm node={selectedNode} />
        <AIQuestions node={selectedNode} />
      </div>
    </div>
  );
}
