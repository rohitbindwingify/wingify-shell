/** Dummy MTU usage for Settings → Web Experimentation & Rollout. */

export const WEB_EXP_SUBSCRIPTION_PATH =
  "/settings/subscription/web-experimentation-rollout";

export const MTU_HISTORY_PATH = `${WEB_EXP_SUBSCRIPTION_PATH}/history`;

export const WEB_EXP_PLAN = {
  name: "Enterprise plan",
  status: "Active",
  consumed: "137K",
  consumedDetail: "of 1.20M, expires on Jun 15, 2028",
  renewal: "Aug 24, 2027",
  billing: "Annually",
  retention: "13 Months",
  rangeLabel: "Sep 13, 2026 – Oct 14, 2026",
} as const;

export type MtuWorkspace = {
  id: string;
  name: string;
  /** Chart series token. */
  swatch: string;
  total: string;
  /** One value per day from Sep 13 through Oct 14, 2026. */
  daily: number[];
};

const START = new Date(2026, 8, 13);

/** Sep 13 → Oct 14 inclusive. */
export const MTU_DAY_COUNT = 32;

export function mtuDay(index: number): Date {
  const date = new Date(START);
  date.setDate(START.getDate() + index);
  return date;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatMtuAxisDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function formatMtuCount(value: number): string {
  if (value >= 1000) {
    const thousands = value / 1000;
    const rounded = Math.round(thousands * 10) / 10;
    return Number.isInteger(rounded) ? `${rounded}K` : `${rounded}K`;
  }
  return String(value);
}

/**
 * Daily stacks, Sep 13–Oct 14. Last nine days match the workspace table
 * (Oct 6–Oct 14). Earlier days follow the usage chart shape.
 */
const MASTER = [
  1800, 2100, 3000, 1100, 400, 180, 220, 260, 300, 240, 280, 320, 200, 260, 340,
  180, 220, 400, 360, 300, 280, 240, 210, 225, 364, 329, 293, 176, 180, 292, 373,
  175,
];

const APP = [
  1400, 2300, 2300, 2000, 900, 1100, 700, 1500, 1400, 1600, 1800, 900, 1700, 1200,
  1600, 1400, 1900, 1700, 1500, 1800, 1600, 900, 400, 2000, 2000, 2000, 1000, 546,
  297, 1000, 2000, 443,
];

const CONTENT = Array.from({ length: 32 }, () => 0);

const SAMPLE = [
  20, 30, 18, 12, 8, 6, 10, 14, 8, 6, 12, 4, 10, 8, 6, 14, 10, 8, 16, 12, 4, 2, 1,
  0, 0, 2, 2, 1, 1, 1, 2, 2,
];

const ROADMAP = [
  40, 55, 30, 22, 18, 12, 20, 28, 16, 14, 24, 10, 18, 16, 12, 26, 18, 14, 22, 16,
  8, 4, 6, 25, 13, 11, 5, 0, 1, 7, 12, 0,
];

export const MTU_WORKSPACES: MtuWorkspace[] = [
  {
    id: "master",
    name: "Wingify.com Master",
    swatch: "var(--chart-div-1)",
    total: "17K",
    daily: MASTER,
  },
  {
    id: "app",
    name: "Wingify App",
    swatch: "var(--chart-div-6)",
    total: "42K",
    daily: APP,
  },
  {
    id: "content",
    name: "Content Feedback",
    swatch: "var(--chart-div-2)",
    total: "0",
    daily: CONTENT,
  },
  {
    id: "sample",
    name: "Sample Account",
    swatch: "var(--chart-div-5)",
    total: "109",
    daily: SAMPLE,
  },
  {
    id: "roadmap",
    name: "roadmap-hub",
    swatch: "var(--chart-div-3)",
    total: "74",
    daily: ROADMAP,
  },
];

/** Table row order from the usage screen. */
export const MTU_TABLE_ORDER = ["app", "master", "sample", "roadmap", "content"];

/** Oct 6 is index 23 (Sep 13 + 23 days). */
export const MTU_TABLE_START = 23;

export type MtuCycleWorkspace = {
  name: string;
  consumption: string;
  /** Name sits in a quiet outline, matching the primary workspaces. */
  boxed?: boolean;
};

export type MtuBillingCycle = {
  id: string;
  range: string;
  current?: boolean;
  plan: string;
  consumption: string;
  workspaces: MtuCycleWorkspace[];
};

const CYCLE_WORKSPACES = (
  rows: [string, string][]
): MtuCycleWorkspace[] =>
  rows.map(([name, consumption]) => ({
    name,
    consumption,
    boxed: name === "Wingify.com Master" || name === "Wingify App",
  }));

let historyPageRows: MtuBillingCycle[] = [];

export function setMtuHistoryPageRows(rows: MtuBillingCycle[]) {
  historyPageRows = rows;
}

export function mtuHistoryPageRows(): MtuBillingCycle[] {
  return historyPageRows;
}

export function downloadMtuCycles(cycles: MtuBillingCycle[]) {
  const lines = [
    "Billing frequency,Plan,MTU consumptions,Workspace,Consumption breakdown",
  ];
  for (const cycle of cycles) {
    lines.push(
      `"${cycle.range}${cycle.current ? " (Current Cycle)" : ""}",${cycle.plan},"${cycle.consumption}",,`
    );
    for (const workspace of cycle.workspaces) {
      lines.push(`,,,${workspace.name},${workspace.consumption}`);
    }
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "historical-mtu-consumption.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export const MTU_BILLING_CYCLES: MtuBillingCycle[] = [
  {
    id: "2026-2028",
    range: "Aug 24, 2026 – Jun 15, 2028",
    current: true,
    plan: "Enterprise",
    consumption: "137K / 1.20M MTUs",
    workspaces: CYCLE_WORKSPACES([
      ["Wingify.com Master", "68K"],
      ["Wingify App", "68K"],
      ["Sample Account", "135"],
      ["roadmap-hub", "74"],
      ["Content Feedback", "0"],
    ]),
  },
  {
    id: "2023-2028",
    range: "Jun 15, 2023 – Jun 15, 2028",
    plan: "Enterprise",
    consumption: "6.52M / 23.0M MTUs",
    workspaces: CYCLE_WORKSPACES([
      ["Wingify.com Master", "3.10M"],
      ["Wingify App", "3.40M"],
      ["Sample Account", "12K"],
      ["roadmap-hub", "8K"],
      ["Content Feedback", "0"],
    ]),
  },
  {
    id: "2019-2024",
    range: "Sep 2, 2019 – Sep 2, 2024",
    plan: "Enterprise",
    consumption: "4.93M / 22.4M MTUs",
    workspaces: CYCLE_WORKSPACES([
      ["Wingify.com Master", "2.40M"],
      ["Wingify App", "2.51M"],
      ["Sample Account", "14K"],
      ["roadmap-hub", "6K"],
      ["Content Feedback", "0"],
    ]),
  },
  {
    id: "2010",
    range: "Apr 22, 2010 – Jun 3, 2010",
    plan: "Growth",
    consumption: "0 / 21.9M MTUs",
    workspaces: CYCLE_WORKSPACES([
      ["Wingify.com Master", "0"],
      ["Wingify App", "0"],
      ["Sample Account", "0"],
      ["roadmap-hub", "0"],
      ["Content Feedback", "0"],
    ]),
  },
  {
    id: "2011-2013",
    range: "Jul 14, 2011 – May 21, 2013",
    plan: "Growth",
    consumption: "0 / 21.8M MTUs",
    workspaces: CYCLE_WORKSPACES([
      ["Wingify.com Master", "0"],
      ["Wingify App", "0"],
      ["Sample Account", "0"],
      ["roadmap-hub", "0"],
      ["Content Feedback", "0"],
    ]),
  },
  {
    id: "2016-2017",
    range: "May 26, 2016 – May 26, 2017",
    plan: "Enterprise",
    consumption: "0 / 93.8M MTUs",
    workspaces: CYCLE_WORKSPACES([
      ["Wingify.com Master", "0"],
      ["Wingify App", "0"],
      ["Sample Account", "0"],
      ["roadmap-hub", "0"],
      ["Content Feedback", "0"],
    ]),
  },
];
