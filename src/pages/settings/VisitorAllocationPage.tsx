/** Settings → Subscription & Invoices → Visitor Allocation. */

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  CircleHelp,
  Flag,
  FlaskConical,
  Megaphone,
  Pencil,
  Target,
  type LucideIcon,
} from "@/components/icons/protoLucide";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type AllocationProduct = {
  id: string;
  name: string;
  icon: LucideIcon;
  cycle: string;
  total: string;
  workspace: string;
  workspaceUsed: string;
};

const PRODUCTS: AllocationProduct[] = [
  {
    id: "web-exp",
    name: "Web Experimentation & Rollout Visitors",
    icon: FlaskConical,
    cycle: "Sep 29, 2026 – Oct 13, 2026",
    total: "1.20M",
    workspace: "Wingify",
    workspaceUsed: "0",
  },
  {
    id: "behavior",
    name: "Behavior Analytics Visitors",
    icon: BarChart3,
    cycle: "Sep 29, 2026 – Oct 13, 2026",
    total: "100K",
    workspace: "Wingify",
    workspaceUsed: "0",
  },
  {
    id: "personalize",
    name: "Web Personalization Visitors",
    icon: Target,
    cycle: "Sep 29, 2026 – Oct 13, 2026",
    total: "1.20M",
    workspace: "Wingify",
    workspaceUsed: "0",
  },
  {
    id: "feature",
    name: "Feature Management Visitors",
    icon: Flag,
    cycle: "Sep 29, 2026 – Oct 13, 2026",
    total: "1.20M",
    workspace: "Wingify",
    workspaceUsed: "0",
  },
  {
    id: "feedback",
    name: "User Feedback Visitors",
    icon: Megaphone,
    cycle: "Sep 29, 2026 – Oct 13, 2026",
    total: "100K",
    workspace: "Wingify",
    workspaceUsed: "0",
  },
];

export default function VisitorAllocationPage() {
  const [openIds, setOpenIds] = useState<string[]>(() =>
    PRODUCTS.map((product) => product.id)
  );

  const toggle = (id: string) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-8 py-6">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-foreground">Visitor Allocation</h1>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                aria-label="About visitor allocation"
              >
                <CircleHelp className="size-4" strokeWidth={1.75} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              Visitors allocated to each workspace for the current subscription cycle.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {PRODUCTS.map((product) => {
        const open = openIds.includes(product.id);
        const Icon = product.icon;
        return (
          <Card
            key={product.id}
            className="grid grid-cols-3 overflow-hidden shadow-none hover:border-border hover:bg-card"
          >
            <div className="flex flex-col gap-4 border-r border-border p-5">
              <div className="flex items-center gap-2">
                <Icon className="size-4 shrink-0 text-foreground" strokeWidth={1.75} />
                <p className="truncate text-sm font-semibold text-foreground">
                  {product.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Subscription Cycle</p>
                <p className="mt-1 text-sm text-foreground">{product.cycle}</p>
              </div>
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-semibold">0</span> used out of{" "}
                  <span className="font-semibold">{product.total}</span> visitors
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full w-2 rounded-full bg-[var(--green-500)]"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2 flex flex-col p-5">
              <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" className="gap-1.5 shadow-none">
                  <Pencil className="size-3.5" strokeWidth={1.75} />
                  Edit Allocation
                </Button>
              </div>

              <button
                type="button"
                onClick={() => toggle(product.id)}
                aria-expanded={open}
                className="mt-4 flex items-start justify-between gap-4 text-left"
              >
                <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-foreground">
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-[280ms]",
                      !open && "-rotate-90"
                    )}
                    strokeWidth={1.75}
                  />
                  Unallocated Usage
                </span>
                <span className="shrink-0 text-right">
                  <span className="block whitespace-nowrap text-xs text-muted-foreground">
                    (Used / Unallocated)
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold tabular-nums text-foreground">
                    0 / {product.total}
                  </span>
                </span>
              </button>

              {open ? (
                <div className="mt-3 flex items-center justify-between gap-4 border-t border-border pt-3 pl-6">
                  <span className="text-sm text-foreground">{product.workspace}</span>
                  <span className="text-sm tabular-nums text-foreground">
                    {product.workspaceUsed}
                  </span>
                </div>
              ) : null}
            </div>
          </Card>
        );
      })}

      <p className="text-sm text-muted-foreground">
        Frequently re-adjusting Behavior Analytics visitors allocated to an account is not
        recommended as it may result in incomplete tracking of a user&apos;s journey.{" "}
        <Button type="button" variant="link" className="h-auto p-0 text-sm">
          Read more
        </Button>
      </p>
      <p className="text-sm text-muted-foreground">
        Do you need more visitors?{" "}
        <Button type="button" variant="link" className="h-auto p-0 text-sm" asChild>
          <Link to="/upgrade">Upgrade</Link>
        </Button>
      </p>
    </div>
  );
}
