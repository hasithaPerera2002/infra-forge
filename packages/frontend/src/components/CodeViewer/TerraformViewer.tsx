import { useMemo } from "react";
import Editor from "@monaco-editor/react";
import { useCanvasState } from "../../hooks/useCanvasState";

export function TerraformViewer() {
  const { terraformCode, isLoadingTerraform } = useCanvasState();

  const fullCode = useMemo(() => {
    if (!terraformCode) return "-- Add components to the canvas and click Generate Terraform --";
    const parts = [
      "# main.tf",
      terraformCode.mainTf,
      "\n# variables.tf",
      terraformCode.variables,
      "\n# outputs.tf",
      terraformCode.outputs,
    ];
    if (terraformCode.backendTf) {
      parts.push("\n# backend.tf", terraformCode.backendTf);
    }
    terraformCode.modules.forEach((m) => {
      parts.push(`\n# modules/${m.name}/main.tf`, m.content);
    });
    return parts.join("\n\n");
  }, [terraformCode]);

  if (isLoadingTerraform) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Generating Terraform...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="hcl"
        value={fullCode}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: "JetBrains Mono, Fira Code, monospace",
        }}
      />
    </div>
  );
}
