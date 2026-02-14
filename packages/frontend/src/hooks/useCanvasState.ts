import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges } from "reactflow";
import type { Node, Edge, NodeChange, EdgeChange } from "reactflow";
import type { Connection, InfrastructureNode, ProjectRequirements } from "../types/infrastructure";
import type { TerraformCode } from "../types/terraform";

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  requirements: ProjectRequirements;
  terraformCode: TerraformCode | null;
  estimatedCost: number | null;
  isLoadingTerraform: boolean;
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, data: Partial<InfrastructureNode>) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (id: string) => void;
  applyNodeChanges: (changes: NodeChange[]) => void;
  applyEdgeChanges: (changes: EdgeChange[]) => void;
  setSelectedNode: (id: string | null) => void;
  setRequirements: (requirements: Partial<ProjectRequirements>) => void;
  setTerraformCode: (code: TerraformCode | null) => void;
  setEstimatedCost: (cost: number | null) => void;
  setLoadingTerraform: (loading: boolean) => void;
  clearCanvas: () => void;
  toInfrastructureGraph: () => { nodes: InfrastructureNode[]; connections: Connection[] };
}

const defaultRequirements: ProjectRequirements = {
  environment: "production",
  traffic: "medium",
  highAvailability: true,
  multiRegion: false,
};

export const useCanvasState = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  requirements: defaultRequirements,
  terraformCode: null,
  estimatedCost: null,
  isLoadingTerraform: false,

  setNodes: (nodes) =>
    set((state) => ({
      nodes: typeof nodes === "function" ? nodes(state.nodes) : nodes,
    })),

  setEdges: (edges) =>
    set((state) => ({
      edges: typeof edges === "function" ? edges(state.edges) : edges,
    })),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  addEdge: (edge) =>
    set((state) => {
      const exists = state.edges.some(
        (e) => e.source === edge.source && e.target === edge.target
      );
      if (exists) return state;
      return { edges: [...state.edges, edge] };
    }),

  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
    })),

  applyNodeChanges: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  applyEdgeChanges: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  setRequirements: (req) =>
    set((state) => ({
      requirements: { ...state.requirements, ...req },
    })),

  setTerraformCode: (code) => set({ terraformCode: code }),

  setEstimatedCost: (cost) => set({ estimatedCost: cost }),

  setLoadingTerraform: (loading) => set({ isLoadingTerraform: loading }),

  clearCanvas: () =>
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      terraformCode: null,
      estimatedCost: null,
    }),

  toInfrastructureGraph: () => {
    const { nodes, edges } = get();
    const infrastructureNodes: InfrastructureNode[] = nodes.map((n) => ({
      id: n.id,
      type: (n.data?.type as InfrastructureNode["type"]) ?? "compute",
      provider: (n.data?.provider as InfrastructureNode["provider"]) ?? "aws",
      component: (n.data?.component as string) ?? "ec2",
      position: n.position ?? { x: 0, y: 0 },
      properties: (n.data?.properties as Record<string, unknown>) ?? {},
    }));

    const connections: Connection[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: "network",
    }));

    return { nodes: infrastructureNodes, connections };
  },
}));
