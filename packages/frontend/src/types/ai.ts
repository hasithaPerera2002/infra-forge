export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: AISuggestion[];
  codeSnippet?: string;
  timestamp: Date;
}

export interface AISuggestion {
  type: "security" | "cost" | "best-practice" | "architecture";
  severity: "info" | "warning" | "critical";
  message: string;
}

export interface AIQuestion {
  id: string;
  text: string;
  type: "single" | "multiple" | "text" | "number";
  options?: { value: string; label: string }[];
  required: boolean;
  context?: string;
}
