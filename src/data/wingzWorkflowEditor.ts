/** Dummy Wingz workflow editor scenarios — light-theme canvas + AI chat. */

export type WorkflowScene = "draft" | "previous" | "history";

export const WORKFLOW_SCENES: WorkflowScene[] = ["draft", "previous", "history"];

export type WorkflowNodeKind = "start" | "agent" | "end";

export type WorkflowNode = {
  id: string;
  kind: WorkflowNodeKind;
  title: string;
  subtitle: string;
  body?: string;
  email?: string;
  /** Green success check — history / completed run. */
  succeeded?: boolean;
};

export type WorkflowChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      text: string;
      details?: { label: string; value: string }[];
      card?: {
        title: string;
        tag: string;
        status?: "Active" | "Draft";
        actionLabel?: string;
      };
    };

export type WorkflowEditorScenario = {
  id: WorkflowScene;
  label: string;
  workflowName: string;
  banner?: {
    tone: "warning" | "info";
    /** Leading glyph — defaults to info. */
    icon?: "info" | "history";
    message: string;
    action?: string;
    /** When set, date/time renders as a dropdown after the message. */
    timestamps?: string[];
  };
  headerActions: "edit" | "history";
  showChat: boolean;
  nodes: WorkflowNode[];
  edgesSucceeded?: boolean;
  chat: WorkflowChatMessage[];
};

const SHARED_NODES_BASE: WorkflowNode[] = [
  {
    id: "start",
    kind: "start",
    title: "Start",
    subtitle: "Time Based",
  },
  {
    id: "agent",
    kind: "agent",
    title: "Agent",
    subtitle: "Wingz",
    body: "At each run, find all currently running Wingify A/B campaigns. Fetch visitor counts for the reporting window.",
  },
  {
    id: "end",
    kind: "end",
    title: "End",
    subtitle: "Notify",
    email: "a@temp.com",
  },
];

const CHAT_THREAD: WorkflowChatMessage[] = [
  {
    id: "u1",
    role: "user",
    text: "create a workflow to fetch visitor info for running AB campaigns weekly and mail me report to a@temp.com",
  },
  {
    id: "a1",
    role: "assistant",
    text: "I’ve drafted a Weekly AB Campaign Visitor Report workflow.",
    details: [
      { label: "Schedule", value: "Weekly" },
      { label: "Agent", value: "Wingz" },
      { label: "Delivery", value: "Email to a@temp.com" },
      { label: "Status", value: "Active" },
    ],
    card: {
      title: "Email weekly campaign visitor reports",
      tag: "Workflow Editor",
      status: "Active",
      actionLabel: "Open",
    },
  },
];

export const WORKFLOW_EDITOR_SCENARIOS: Record<
  WorkflowScene,
  WorkflowEditorScenario
> = {
  draft: {
    id: "draft",
    label: "Draft with AI",
    workflowName: "Weekly AB Campaign Visitor Report",
    headerActions: "edit",
    showChat: true,
    nodes: SHARED_NODES_BASE,
    chat: CHAT_THREAD,
  },
  previous: {
    id: "previous",
    label: "Previous version",
    workflowName: "Weekly AB Campaign Visitor Report",
    banner: {
      tone: "info",
      message: "You're viewing a previous version of this workflow.",
      action: "Return to saved",
    },
    headerActions: "edit",
    showChat: true,
    nodes: SHARED_NODES_BASE,
    chat: [
      CHAT_THREAD[0],
      {
        id: "a2",
        role: "assistant",
        text: "Here’s the saved version of your workflow. You can return to the latest draft anytime.",
        details: [
          { label: "Schedule", value: "Weekly" },
          { label: "Agent", value: "Wingz" },
          { label: "Delivery", value: "Email to a@temp.com" },
          { label: "Status", value: "Active" },
        ],
        card: {
          title: "Email weekly campaign visitor reports",
          tag: "Workflow Editor",
          status: "Active",
          actionLabel: "Open",
        },
      },
    ],
  },
  history: {
    id: "history",
    label: "Run history",
    workflowName: "Weekly AB Campaign Visitor Report",
    banner: {
      tone: "info",
      icon: "history",
      message:
        "You are currently viewing the history log for the workflow Weekly AB Campaign Visitor Report —",
      timestamps: [
        "21 Oct 2026, 15:19",
        "18 Oct 2026, 11:04",
        "12 Oct 2026, 09:32",
      ],
    },
    headerActions: "history",
    showChat: false,
    edgesSucceeded: true,
    nodes: [
      {
        id: "start",
        kind: "start",
        title: "Start",
        subtitle: "Condition Based",
        succeeded: true,
      },
      {
        id: "agent",
        kind: "agent",
        title: "Agent",
        subtitle: "Wingz",
        body: "Tell me campaign id and current status of campaign",
        succeeded: true,
      },
      {
        id: "end",
        kind: "end",
        title: "End",
        subtitle: "Notify",
        email: "abhishek.kumar@wingify.com",
        succeeded: true,
      },
    ],
    chat: [],
  },
};

export const WORKFLOW_EDITOR_ID = "weekly-ab-report";

/** Switcher rows for the workflow editor entity crumb. */
export const WORKFLOW_SWITCHER_ITEMS = [
  {
    id: WORKFLOW_EDITOR_ID,
    name: "Draft with AI — Weekly AB Campaign Visitor Report",
    displayId: "1842",
    href: `/wingz/workflows/${WORKFLOW_EDITOR_ID}?scene=draft`,
  },
  {
    id: "1",
    name: "Previous version — Weekly AB Campaign Visitor Report",
    displayId: "1",
    href: `/wingz/workflows/1?scene=previous`,
  },
  {
    id: "2",
    name: "Run history — Weekly AB Campaign Visitor Report",
    displayId: "2",
    href: `/wingz/workflows/2?scene=history`,
  },
  {
    id: "3",
    name: "New winner announcements",
    displayId: "3",
    href: `/wingz/workflows/3?scene=draft`,
  },
  {
    id: "4",
    name: "Nightly heatmap snapshot",
    displayId: "4",
    href: `/wingz/workflows/4?scene=draft`,
  },
] as const;

/** Active switcher row for the editor crumb (by route id + scene). */
export function resolveWorkflowSwitcherItem(
  id: string,
  scene: WorkflowScene
): (typeof WORKFLOW_SWITCHER_ITEMS)[number] {
  const exact = WORKFLOW_SWITCHER_ITEMS.find((w) => {
    const url = new URL(w.href, "http://local");
    const hrefId = url.pathname.split("/").pop() ?? w.id;
    const hrefScene =
      (url.searchParams.get("scene") as WorkflowScene | null) ?? "draft";
    return hrefId === id && hrefScene === scene;
  });
  if (exact) return exact;

  // List / deep links keep the canonical editor id and only change ?scene=
  if (id === WORKFLOW_EDITOR_ID) {
    const byScene = WORKFLOW_SWITCHER_ITEMS.find((w) => {
      const hrefScene =
        new URL(w.href, "http://local").searchParams.get("scene") ?? "draft";
      return hrefScene === scene;
    });
    if (byScene) return byScene;
  }

  return (
    WORKFLOW_SWITCHER_ITEMS.find((w) => w.id === id) ??
    WORKFLOW_SWITCHER_ITEMS[0]
  );
}
