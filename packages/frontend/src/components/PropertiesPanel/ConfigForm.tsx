import type { Node } from "reactflow";
import { useCanvasState } from "../../hooks/useCanvasState";

interface ConfigFormProps {
  node: Node;
}

export function ConfigForm({ node }: ConfigFormProps) {
  const { updateNode } = useCanvasState();
  const properties = (node.data?.properties as Record<string, unknown>) ?? {};

  const handleChange = (key: string, value: unknown) => {
    updateNode(node.id, {
      properties: { ...properties, [key]: value },
    });
  };

  const component = node.data?.component as string;

  if (component === "ec2") {
    return (
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Instance Type</label>
          <select
            value={(properties.instanceType as string) ?? "t3.medium"}
            onChange={(e) => handleChange("instanceType", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="t3.micro">t3.micro</option>
            <option value="t3.small">t3.small</option>
            <option value="t3.medium">t3.medium</option>
            <option value="t3.large">t3.large</option>
            <option value="t3.xlarge">t3.xlarge</option>
          </select>
        </div>
      </div>
    );
  }

  if (component === "rds") {
    return (
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Engine</label>
          <select
            value={(properties.engine as string) ?? "postgres"}
            onChange={(e) => handleChange("engine", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="postgres">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mariadb">MariaDB</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Instance Class</label>
          <select
            value={(properties.instanceClass as string) ?? "db.t3.medium"}
            onChange={(e) => handleChange("instanceClass", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="db.t3.micro">db.t3.micro</option>
            <option value="db.t3.small">db.t3.small</option>
            <option value="db.t3.medium">db.t3.medium</option>
            <option value="db.t3.large">db.t3.large</option>
          </select>
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={(properties.multiAz as boolean) ?? true}
              onChange={(e) => handleChange("multiAz", e.target.checked)}
            />
            Multi-AZ (High Availability)
          </label>
        </div>
      </div>
    );
  }

  if (component === "asg") {
    return (
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Min Size</label>
          <input
            type="number"
            min={1}
            value={(properties.minSize as number) ?? 2}
            onChange={(e) => handleChange("minSize", parseInt(e.target.value, 10))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Max Size</label>
          <input
            type="number"
            min={1}
            value={(properties.maxSize as number) ?? 10}
            onChange={(e) => handleChange("maxSize", parseInt(e.target.value, 10))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Instance Type</label>
          <select
            value={(properties.instanceType as string) ?? "t3.medium"}
            onChange={(e) => handleChange("instanceType", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="t3.medium">t3.medium</option>
            <option value="t3.large">t3.large</option>
            <option value="t3.xlarge">t3.xlarge</option>
          </select>
        </div>
      </div>
    );
  }

  if (component === "vpc") {
    return (
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">CIDR Block</label>
          <input
            type="text"
            value={(properties.cidr as string) ?? "10.0.0.0/16"}
            onChange={(e) => handleChange("cidr", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Availability Zones</label>
          <select
            value={(properties.azCount as number) ?? 3}
            onChange={(e) => handleChange("azCount", parseInt(e.target.value, 10))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
      </div>
    );
  }

  if (component === "s3") {
    return (
      <div className="space-y-4">
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={(properties.versioning as boolean) ?? true}
              onChange={(e) => handleChange("versioning", e.target.checked)}
            />
            Versioning
          </label>
        </div>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={(properties.encryption as boolean) ?? true}
              onChange={(e) => handleChange("encryption", e.target.checked)}
            />
            Encryption
          </label>
        </div>
      </div>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      No configurable properties for this component.
    </p>
  );
}
