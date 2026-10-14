/** Historical MTU consumption by billing cycle.
 * Opened from View consumptions on Web Experimentation & Rollout.
 */

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "@/components/icons/protoLucide";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MTU_BILLING_CYCLES,
  type MtuBillingCycle,
} from "@/data/webExperimentationSubscription";
import { cn } from "@/lib/utils";

const PAGE_SIZES = [10, 25, 50];

export default function HistoricalMtuConsumption() {
  const [openIds, setOpenIds] = useState<string[]>(() =>
    MTU_BILLING_CYCLES.filter((cycle) => cycle.current).map((cycle) => cycle.id)
  );
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(MTU_BILLING_CYCLES.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return MTU_BILLING_CYCLES.slice(start, start + pageSize);
  }, [currentPage, pageSize]);

  const toggle = (id: string) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-8 py-6">
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Billing frequency</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 text-right font-medium">MTU consumptions</th>
            </tr>
          </thead>
          {pageRows.map((cycle) => {
            const open = openIds.includes(cycle.id);
            return (
              <CycleRows
                key={cycle.id}
                cycle={cycle}
                open={open}
                onToggle={() => toggle(cycle.id)}
              />
            );
          })}
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[72px]" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>items</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shadow-none"
            disabled={currentPage <= 1}
            onClick={() => setPage(1)}
            aria-label="First page"
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shadow-none"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-8 px-2 text-center tabular-nums text-foreground">
            {currentPage}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shadow-none"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shadow-none"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(totalPages)}
            aria-label="Last page"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CycleRows({
  cycle,
  open,
  onToggle,
}: {
  cycle: MtuBillingCycle;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <tbody>
      <tr className="border-t border-border">
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="inline-flex items-center gap-2 text-left text-sm text-foreground"
          >
            <ChevronRight
              className={cn(
                "size-4 text-muted-foreground transition-transform duration-[280ms]",
                open && "rotate-90"
              )}
              strokeWidth={1.75}
              aria-hidden
            />
            <span>{cycle.range}</span>
            {cycle.current ? (
              <Badge tone="neutral" fill="light" size="sm">
                Current Cycle
              </Badge>
            ) : null}
          </button>
        </td>
        <td className="px-4 py-3 text-foreground">{cycle.plan}</td>
        <td className="px-4 py-3 text-right tabular-nums text-foreground">
          {cycle.consumption}
        </td>
      </tr>
      {open
        ? cycle.workspaces.map((workspace, index) => (
            <tr key={workspace.name}>
              <td
                className={cn(
                  "py-1.5 pl-10 pr-4 text-sm text-foreground",
                  index === cycle.workspaces.length - 1 && "pb-3"
                )}
              >
                {workspace.name}
              </td>
              <td />
              <td
                className={cn(
                  "px-4 py-1.5 text-right text-sm tabular-nums text-foreground",
                  index === cycle.workspaces.length - 1 && "pb-3"
                )}
              >
                {workspace.consumption}
              </td>
            </tr>
          ))
        : null}
    </tbody>
  );
}
