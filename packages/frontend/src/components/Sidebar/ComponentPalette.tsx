import { useState } from "react";
import { Server, Activity, Zap, Database, Table, HardDrive, Folder, Globe, Scale, ArrowRightLeft, Shield, Key } from "lucide-react";
import { COMPONENT_LIBRARY, COMPONENT_CATEGORIES } from "./ComponentLibrary";
import { SearchComponents } from "./SearchComponents";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Server,
  Activity,
  Zap,
  Database,
  Table,
  HardDrive,
  Folder,
  Globe,
  Scale,
  ArrowRightLeft,
  Shield,
  Key,
};

export function ComponentPalette() {
  const [search, setSearch] = useState("");

  const filteredComponents = search
    ? COMPONENT_LIBRARY.filter(
        (c) =>
          c.label.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase())
      )
    : COMPONENT_LIBRARY;

  const onDragStart = (event: React.DragEvent, component: (typeof COMPONENT_LIBRARY)[0]) => {
    event.dataTransfer.setData(
      "application/infraforge-component",
      JSON.stringify({
        id: component.id,
        label: component.label,
        component: component.component,
        type: component.type,
        provider: component.provider,
        icon: component.icon,
        defaultProperties: component.defaultProperties,
      })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="border-b border-border p-3">
        <h2 className="mb-3 font-semibold text-foreground">Components</h2>
        <SearchComponents value={search} onChange={setSearch} placeholder="Search components..." />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {COMPONENT_CATEGORIES.map((category) => {
          const components = filteredComponents.filter((c) => c.category === category);
          if (components.length === 0) return null;
          return (
            <div key={category} className="mb-4">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {category}
              </h3>
              <div className="space-y-1">
                {components.map((component) => (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, component)}
                    className="flex cursor-grab items-center gap-2 rounded-md border border-border bg-background px-3 py-2 transition-colors hover:border-primary/50 hover:bg-accent active:cursor-grabbing"
                  >
                    {(() => {
                      const Icon = ICON_MAP[component.icon] ?? Server;
                      return <Icon className="h-5 w-5 shrink-0 text-primary" />;
                    })()}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{component.label}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {component.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
