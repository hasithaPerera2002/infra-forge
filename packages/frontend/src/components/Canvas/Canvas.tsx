import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  type Connection,
  type Node,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";

import { InfrastructureNode } from "./InfrastructureNode";
import { useCanvasState } from "../../hooks/useCanvasState";
import { generateId } from "../../lib/utils";

const nodeTypes = { infrastructure: InfrastructureNode };

export function Canvas() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    setSelectedNode,
    addNode,
    addEdge: addStoreEdge,
    applyNodeChanges,
    applyEdgeChanges,
  } = useCanvasState();

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = { ...params, id: generateId(), type: "smoothstep" };
      setEdges((eds) => addEdge(edge, eds));
      addStoreEdge(edge);
    },
    [addStoreEdge, setEdges]
  );

  const onNodesChange = useCallback(
    (changes: Parameters<typeof applyNodeChanges>[0]) => {
      applyNodeChanges(changes);
    },
    [applyNodeChanges]
  );

  const onEdgesChange = useCallback(
    (changes: Parameters<typeof applyEdgeChanges>[0]) => {
      applyEdgeChanges(changes);
    },
    [applyEdgeChanges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const dataStr = event.dataTransfer.getData("application/infraforge-component");
      if (!dataStr) return;

      const data = JSON.parse(dataStr) as {
        id: string;
        label: string;
        component: string;
        type: string;
        provider: string;
        icon: string;
        defaultProperties: Record<string, unknown>;
      };

      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left - 75,
        y: event.clientY - rect.top - 25,
      };

      const node: Node = {
        id: generateId(),
        type: "infrastructure",
        position,
        data: {
          ...data,
          label: data.label,
          component: data.component,
          type: data.type,
          provider: data.provider,
          properties: data.defaultProperties,
        },
      };

      addNode(node);
      setNodes((nds) => [...nds, node]);
    },
    [addNode, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{ type: "smoothstep" }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls className="!bg-card !border-border !rounded-lg" />
        <MiniMap
          className="!bg-card !border-border"
          nodeColor="#22c55e"
          maskColor="rgba(0,0,0,0.7)"
        />
      </ReactFlow>
    </div>
  );
}
