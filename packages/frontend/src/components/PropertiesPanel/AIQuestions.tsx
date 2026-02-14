import type { Node } from "reactflow";

interface AIQuestionsProps {
  node: Node;
}

export function AIQuestions({ node }: AIQuestionsProps) {
  return (
    <div className="mt-6 border-t border-border pt-4">
      <h3 className="mb-2 text-sm font-medium text-foreground">AI Suggestions</h3>
      <p className="text-sm text-muted-foreground">
        AI-powered questions and recommendations will appear here when the AI agent is enabled.
      </p>
      <div className="mt-3 rounded-md bg-muted/50 p-3 text-sm">
        <p className="text-muted-foreground">
          Connect your Anthropic API key to enable intelligent architecture validation and
          production-ready Terraform generation.
        </p>
      </div>
    </div>
  );
}
