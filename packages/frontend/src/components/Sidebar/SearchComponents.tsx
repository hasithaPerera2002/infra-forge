import { Search } from "lucide-react";

interface SearchComponentsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchComponents({ value, onChange, placeholder = "Search..." }: SearchComponentsProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
