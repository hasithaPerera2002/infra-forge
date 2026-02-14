const PRICING = {
  ec2: {
    "t3.micro": 0.0104,
    "t3.small": 0.0208,
    "t3.medium": 0.0416,
    "t3.large": 0.0832,
    "t3.xlarge": 0.1664,
  },
  rds: {
    "db.t3.micro": 0.017,
    "db.t3.small": 0.034,
    "db.t3.medium": 0.068,
    "db.t3.large": 0.136,
  },
  alb: 0.0225,
  nat_gateway: 0.045,
  s3: 0.023,
};

const HOURS_PER_MONTH = 730;

interface Node {
  component?: string;
  properties?: Record<string, unknown>;
}

export class CostCalculator {
  calculate(nodes: Node[]): {
    estimated_monthly: number;
    breakdown: Record<string, number>;
    currency: string;
  } {
    let total = 0;
    const breakdown: Record<string, number> = {};

    for (const node of nodes) {
      const component = node.component ?? "";
      const props = node.properties ?? {};

      if (component === "ec2") {
        const it = (props.instanceType as string) ?? "t3.medium";
        const hourly = (PRICING.ec2 as Record<string, number>)[it] ?? PRICING.ec2["t3.medium"];
        const cost = hourly * HOURS_PER_MONTH;
        breakdown["EC2 Instance"] = Math.round(cost * 100) / 100;
        total += cost;
      } else if (component === "asg") {
        const it = (props.instanceType as string) ?? "t3.medium";
        const minSize = (props.minSize as number) ?? 2;
        const hourly = (PRICING.ec2 as Record<string, number>)[it] ?? PRICING.ec2["t3.medium"];
        const cost = hourly * HOURS_PER_MONTH * minSize;
        breakdown["Auto Scaling Group"] = Math.round(cost * 100) / 100;
        total += cost;
      } else if (component === "rds") {
        const ic = (props.instanceClass as string) ?? "db.t3.medium";
        const multiAz = (props.multiAz as boolean) ?? true;
        const hourly = (PRICING.rds as Record<string, number>)[ic] ?? PRICING.rds["db.t3.medium"];
        const storageGb = (props.allocatedStorage as number) ?? 100;
        const storageCost = 0.115 * storageGb;
        const cost =
          hourly * HOURS_PER_MONTH * (multiAz ? 2 : 1) + storageCost;
        breakdown["RDS Database"] = Math.round(cost * 100) / 100;
        total += cost;
      } else if (component === "alb") {
        const cost = PRICING.alb * HOURS_PER_MONTH;
        breakdown["Application Load Balancer"] = Math.round(cost * 100) / 100;
        total += cost;
      } else if (component === "vpc") {
        const cost = PRICING.nat_gateway * HOURS_PER_MONTH;
        breakdown["NAT Gateway"] = Math.round(cost * 100) / 100;
        total += cost;
      } else if (component === "s3") {
        const cost = PRICING.s3 * 100;
        breakdown["S3 Storage"] = Math.round(cost * 100) / 100;
        total += cost;
      }
    }

    return {
      estimated_monthly: Math.round(total * 100) / 100,
      breakdown,
      currency: "USD",
    };
  }
}
