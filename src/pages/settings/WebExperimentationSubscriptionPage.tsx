/** Settings → Subscription → Web Experimentation & Rollout.
 * Plan name and status live in the drill-in header. Meeting / plan / more
 * are icon buttons there too — this page is the usage body only.
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MTU_HISTORY_PATH } from "@/data/webExperimentationSubscription";
import {
  CircleHelp,
  Download,
  History,
  Info,
  Search,
} from "@/components/icons/protoLucide";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MTU_DAY_COUNT,
  MTU_TABLE_ORDER,
  MTU_TABLE_START,
  MTU_WORKSPACES,
  WEB_EXP_PLAN,
  formatMtuAxisDate,
  formatMtuCount,
  mtuDay,
  type MtuWorkspace,
} from "@/data/webExperimentationSubscription";
import { cn } from "@/lib/utils";

const Y_MAX = 6000;
const Y_TICKS = [6000, 5000, 4000, 3000, 2000, 1000, 0];

function InfoTip({ label }: { label: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex text-muted-foreground hover:text-foreground"
            aria-label={label}
          >
            <Info className="size-3.5" strokeWidth={1.75} aria-hidden />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type Bucket = { label: string; values: number[] };

function dailyBuckets(workspaces: MtuWorkspace[]): Bucket[] {
  return Array.from({ length: MTU_DAY_COUNT }, (_, index) => ({
    label: formatMtuAxisDate(mtuDay(index)),
    values: workspaces.map((workspace) => workspace.daily[index] ?? 0),
  }));
}

function monthlyBuckets(workspaces: MtuWorkspace[]): Bucket[] {
  const groups = new Map<string, number[]>();
  for (let index = 0; index < MTU_DAY_COUNT; index += 1) {
    const date = mtuDay(index);
    const key = `${formatMtuAxisDate(date).split(" ")[0]} ${date.getFullYear()}`;
    const current = groups.get(key) ?? workspaces.map(() => 0);
    workspaces.forEach((workspace, series) => {
      current[series] += workspace.daily[index] ?? 0;
    });
    groups.set(key, current);
  }
  return [...groups.entries()].map(([label, values]) => ({ label, values }));
}

function applyCumulative(buckets: Bucket[]): Bucket[] {
  const running = buckets[0] ? buckets[0].values.map(() => 0) : [];
  return buckets.map((bucket) => {
    bucket.values.forEach((value, index) => {
      running[index] += value;
    });
    return { label: bucket.label, values: [...running] };
  });
}

function UsageChart({
  buckets,
  workspaces,
  visible,
  cumulative,
}: {
  buckets: Bucket[];
  workspaces: MtuWorkspace[];
  visible: Record<string, boolean>;
  cumulative: boolean;
}) {
  const stackedMax = Math.max(
    Y_MAX,
    ...buckets.map((bucket) =>
      bucket.values.reduce(
        (sum, value, index) =>
          visible[workspaces[index].id] ? sum + value : sum,
        0
      )
    )
  );
  const scaleMax = cumulative ? stackedMax : Y_MAX;
  const visibleTotals = buckets.map((bucket) =>
    bucket.values.reduce(
      (sum, value, index) =>
        visible[workspaces[index].id] ? sum + value : sum,
      0
    )
  );
  const average =
    visibleTotals.reduce((sum, value) => sum + value, 0) /
    Math.max(visibleTotals.length, 1);
  const showAverage = !cumulative && average > 0;

  return (
    <div className="flex gap-3">
      <div className="flex items-center">
        <span className="text-[10px] font-medium tracking-wide text-muted-foreground [writing-mode:vertical-rl] rotate-180">
          Consumption of MTUs
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex">
          <div className="flex h-56 w-10 shrink-0 flex-col justify-between pr-2 text-right text-[10px] tabular-nums text-muted-foreground">
            {(cumulative
              ? [scaleMax, scaleMax * 0.75, scaleMax * 0.5, scaleMax * 0.25, 0]
              : Y_TICKS
            ).map((tick) => (
              <span key={tick}>
                {Math.round(tick).toLocaleString("en-US")}
              </span>
            ))}
          </div>
          <div className="relative min-w-0 flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 right-14 flex flex-col justify-between">
              {(cumulative ? [0, 1, 2, 3, 4] : Y_TICKS).map((tick) => (
                <div key={tick} className="border-t border-dashed border-border" />
              ))}
            </div>
            {showAverage ? (
              <div
                className="pointer-events-none absolute left-0 right-14 border-t border-dashed border-foreground/40"
                style={{ bottom: `${(average / scaleMax) * 100}%` }}
              >
                <span className="absolute -top-2 left-full ml-1 whitespace-nowrap text-[10px] text-muted-foreground">
                  Avg {formatMtuCount(Math.round(average))}
                </span>
              </div>
            ) : null}
            <div className="relative mr-14 flex h-56 items-end gap-1">
              {buckets.map((bucket) => (
                <div
                  key={bucket.label}
                  className="flex h-full min-w-0 flex-1 flex-col justify-end"
                >
                  {[...workspaces].reverse().map((workspace) => {
                    const index = workspaces.indexOf(workspace);
                    if (!visible[workspace.id]) return null;
                    const value = bucket.values[index] ?? 0;
                    if (value <= 0) return null;
                    return (
                      <div
                        key={workspace.id}
                        className="w-full"
                        style={{
                          height: `${(value / scaleMax) * 100}%`,
                          background: workspace.swatch,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 flex pl-10">
          <div className="mr-14 flex min-w-0 flex-1">
            {buckets.map((bucket, index) => (
              <div key={bucket.label} className="min-w-0 flex-1 text-center">
                {buckets.length <= 4 || index % 3 === 0 ? (
                  <span className="text-[10px] text-muted-foreground">
                    {bucket.label}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {workspaces.map((workspace) => (
            <span
              key={workspace.id}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
                !visible[workspace.id] && "opacity-40"
              )}
            >
              <span
                className="size-2 rounded-full"
                style={{ background: workspace.swatch }}
              />
              {workspace.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WebExperimentationSubscriptionPage() {
  const navigate = useNavigate();
  const [usageTab, setUsageTab] = useState("workspace");
  const [cumulative, setCumulative] = useState(false);
  const [grain, setGrain] = useState<"daily" | "monthly">("daily");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(MTU_WORKSPACES.map((workspace) => [workspace.id, true]))
  );

  const chartWorkspaces = useMemo(
    () =>
      usageTab === "total"
        ? [
            {
              id: "total",
              name: "Total",
              swatch: "var(--cherry-500)",
              total: "",
              daily: Array.from({ length: MTU_DAY_COUNT }, (_, index) =>
                MTU_WORKSPACES.reduce(
                  (sum, workspace) => sum + (workspace.daily[index] ?? 0),
                  0
                )
              ),
            },
          ]
        : MTU_WORKSPACES,
    [usageTab]
  );

  const chartVisible = useMemo(
    () =>
      usageTab === "total"
        ? { total: true }
        : visible,
    [usageTab, visible]
  );

  const buckets = useMemo(() => {
    const base =
      grain === "monthly"
        ? monthlyBuckets(chartWorkspaces)
        : dailyBuckets(chartWorkspaces);
    return cumulative ? applyCumulative(base) : base;
  }, [chartWorkspaces, cumulative, grain]);

  const tableRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ordered = MTU_TABLE_ORDER.map(
      (id) => MTU_WORKSPACES.find((workspace) => workspace.id === id)!
    );
    return ordered.filter((workspace) =>
      workspace.name.toLowerCase().includes(q)
    );
  }, [query]);

  const tableDates = Array.from(
    { length: MTU_DAY_COUNT - MTU_TABLE_START },
    (_, offset) => formatMtuAxisDate(mtuDay(MTU_TABLE_START + offset))
  );

  const allChecked =
    tableRows.length > 0 && tableRows.every((row) => visible[row.id]);
  const someChecked = tableRows.some((row) => visible[row.id]);

  const exportCsv = () => {
    const header = ["Workspace", "Total", ...tableDates];
    const lines = tableRows.map((row) =>
      [
        row.name,
        row.total,
        ...row.daily.slice(MTU_TABLE_START).map(String),
      ].join(",")
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "workspace-mtu-usage.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-8 py-6">
      <Card className="shadow-none hover:border-border hover:bg-card">
        <div className="grid gap-6 px-6 py-5 sm:grid-cols-[1fr_auto_1fr]">
          <div>
            <p className="text-xs text-muted-foreground">MTU consumed</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
              {WEB_EXP_PLAN.consumed}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              {WEB_EXP_PLAN.consumedDetail}
              <InfoTip label={WEB_EXP_PLAN.consumedDetail} />
            </p>
          </div>
          <div className="hidden w-px bg-border sm:block" aria-hidden />
          <div className="sm:text-right">
            <p className="text-xs text-muted-foreground">Next renewal</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {WEB_EXP_PLAN.renewal}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground sm:justify-end">
              Billing frequency: {WEB_EXP_PLAN.billing}
              <InfoTip label={`Billing frequency: ${WEB_EXP_PLAN.billing}`} />
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-3">
          <p className="inline-flex items-center gap-2 text-sm text-foreground">
            <CircleHelp
              className="size-4 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden
            />
            Data retention for {WEB_EXP_PLAN.retention}
          </p>
          <Button type="button" variant="link" className="text-sm">
            Learn more
          </Button>
        </div>
      </Card>

      <Card className="shadow-none hover:border-border hover:bg-card">
        <Tabs value={usageTab} onValueChange={setUsageTab}>
          <div className="border-b border-border px-6 pt-2">
            <TabsList variant="underline">
              <TabsTrigger value="total">Total MTU usage</TabsTrigger>
              <TabsTrigger value="workspace">Workspace MTU usage</TabsTrigger>
            </TabsList>
          </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="text-sm font-medium text-foreground">
            {usageTab === "total" ? "Total MTU usage" : "Workspace MTU usage"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9 gap-2 px-3 shadow-none"
            >
              {WEB_EXP_PLAN.rangeLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 gap-1.5 px-3 shadow-none"
              onClick={exportCsv}
            >
              <Download className="size-4" strokeWidth={1.75} aria-hidden />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 pb-2">
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <Switch
              checked={cumulative}
              onCheckedChange={setCumulative}
              aria-label="Show cumulative"
            />
            Show cumulative
          </label>
          <div className="inline-flex rounded-lg border border-border p-0.5">
            {(["daily", "monthly"] as const).map((option) => (
              <Button
                key={option}
                type="button"
                variant={grain === option ? "secondary" : "ghost"}
                className="h-8 capitalize shadow-none"
                onClick={() => setGrain(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <UsageChart
            buckets={buckets}
            workspaces={chartWorkspaces}
            visible={chartVisible}
            cumulative={cumulative}
          />
        </div>

        <div className="border-t border-border px-6 py-4">
          <div className="relative max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Workspace"
              aria-label="Search Workspace"
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto px-6 pb-4">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="w-10 rounded-tl-lg border border-border bg-muted/40 px-3 py-2.5">
                  <Checkbox
                    checked={
                      allChecked ? true : someChecked ? "indeterminate" : false
                    }
                    onCheckedChange={(checked) => {
                      const next = checked === true;
                      setVisible((current) => {
                        const copy = { ...current };
                        for (const row of tableRows) copy[row.id] = next;
                        return copy;
                      });
                    }}
                    aria-label="Toggle all workspaces"
                  />
                </th>
                <th className="border-y border-r border-border bg-muted/40 px-3 py-2.5 font-medium">
                  Workspace
                </th>
                <th className="border-y border-r border-border bg-muted/40 px-3 py-2.5 font-medium">
                  Total
                </th>
                {tableDates.map((date, index) => (
                  <th
                    key={date}
                    className={cn(
                      "border-y border-r border-border bg-muted/40 px-3 py-2.5 font-medium",
                      index === tableDates.length - 1 && "rounded-tr-lg"
                    )}
                  >
                    {date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.id}>
                  <td className="border-x border-b border-border px-3 py-2.5">
                    <Checkbox
                      checked={visible[row.id]}
                      onCheckedChange={(checked) =>
                        setVisible((current) => ({
                          ...current,
                          [row.id]: checked === true,
                        }))
                      }
                      aria-label={`Toggle ${row.name}`}
                    />
                  </td>
                  <td className="border-b border-r border-border px-3 py-2.5">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: row.swatch }}
                      />
                      {row.name}
                    </span>
                  </td>
                  <td className="border-b border-r border-border px-3 py-2.5 tabular-nums">
                    {row.total}
                  </td>
                  {row.daily.slice(MTU_TABLE_START).map((value, index) => (
                    <td
                      key={tableDates[index]}
                      className="border-b border-r border-border px-3 py-2.5 tabular-nums text-muted-foreground"
                    >
                      {formatMtuCount(value)}
                    </td>
                  ))}
                </tr>
              ))}
              {tableRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={3 + tableDates.length}
                    className="border border-border px-3 py-8 text-center text-sm text-muted-foreground"
                  >
                    No workspaces match that search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4">
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <History className="size-4" strokeWidth={1.75} aria-hidden />
            Access historical MTU consumption by billing cycle
          </p>
          <Button
            type="button"
            variant="outline"
            className="h-9 shadow-none"
            onClick={() => navigate(MTU_HISTORY_PATH)}
          >
            View consumptions
          </Button>
        </div>
        </Tabs>
      </Card>
    </div>
  );
}
