import { useState } from "react";
import { Canvas } from "./components/Canvas/Canvas";
import { ComponentPalette } from "./components/Sidebar/ComponentPalette";
import { PropertiesPanel } from "./components/PropertiesPanel/PropertiesPanel";
import { TerraformViewer } from "./components/CodeViewer/TerraformViewer";
import { CostEstimate } from "./components/CodeViewer/CostEstimate";
import { ValidationPanel } from "./components/ValidationPanel/ValidationPanel";
import { AIChat } from "./components/Chat/AIChat";
import { useCanvasState } from "./hooks/useCanvasState";
import { useTerraformGeneration } from "./hooks/useTerraformGeneration";
import { Play, Code, MessageSquare, LayoutGrid, Trash2 } from "lucide-react";

type Tab = "canvas" | "code" | "chat";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("canvas");
  const { nodes, clearCanvas } = useCanvasState();
  const { generate } = useTerraformGeneration();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generate();
      setActiveTab("code");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to generate Terraform");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-primary">InfraForge</h1>
          <span className="text-sm text-muted-foreground">
            AI-Powered Infrastructure Builder
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={nodes.length === 0 || generating}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            {generating ? "Generating..." : "Generate Terraform"}
          </button>
          <button
            onClick={clearCanvas}
            className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar - Component palette */}
        <div className="w-64 shrink-0">
          <ComponentPalette />
        </div>

        {/* Center - Canvas / Code / Chat */}
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("canvas")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "canvas"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Canvas
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "code"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code className="h-4 w-4" />
              Terraform
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "chat"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </button>
          </div>

          <div className="flex-1 min-h-0">
            {activeTab === "canvas" && (
              <div className="h-full">
                <Canvas />
              </div>
            )}
            {activeTab === "code" && (
              <div className="flex h-full gap-4 p-4">
                <div className="flex-1 min-w-0 rounded-lg border border-border overflow-hidden">
                  <TerraformViewer />
                </div>
                <div className="w-64 shrink-0 space-y-4">
                  <CostEstimate />
                  <ValidationPanel />
                </div>
              </div>
            )}
            {activeTab === "chat" && (
              <div className="h-full">
                <AIChat />
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar - Properties */}
        <div className="w-80 shrink-0">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
