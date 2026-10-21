/**
 * Wingz workflow editor — light-theme canvas + AI chat for draft / previous / history.
 */

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlignLeft,
  Braces,
  Check,
  Copy,
  Crosshair,
  Lock,
  Mail,
  Maximize2,
  Mic,
  Minus,
  Phone,
  Play,
  Plus,
  SendHorizontal,
  Settings,
  Sparkles,
  Target,
} from "@/components/icons/protoLucide";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  WORKFLOW_EDITOR_SCENARIOS,
  WORKFLOW_SCENES,
  type WorkflowNode,
  type WorkflowScene,
} from "@/data/wingzWorkflowEditor";
import { cn } from "@/lib/utils";

const TOOLBOX = [
  { icon: Play, label: "Start" },
  { icon: Mail, label: "Event" },
  { icon: Crosshair, label: "Identity" },
  { icon: Phone, label: "Notify" },
  { icon: Braces, label: "Code" },
  { icon: Copy, label: "Duplicate" },
] as const;

function nodeHeaderClass(kind: WorkflowNode["kind"]): string {
  if (kind === "start") return "bg-[var(--info-bg)] text-[var(--info-fg)]";
  if (kind === "end") return "bg-[var(--status-draft-bg)] text-[var(--status-draft-fg)]";
  return "bg-muted text-foreground";
}

function NodeCard({ node }: { node: WorkflowNode }) {
  const HeaderIcon =
    node.kind === "start" ? Play : node.kind === "end" ? Target : Sparkles;

  return (
    <div className="relative w-[220px] rounded-xl border border-border bg-background shadow-sm">
      {node.succeeded ? (
        <span
          className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-[var(--status-running-bg)] text-[var(--status-running-fg)] shadow-sm"
          aria-label="Succeeded"
        >
          <Check className="size-3" strokeWidth={2.5} aria-hidden />
        </span>
      ) : null}
      <div
        className={cn(
          "flex items-center gap-2 rounded-t-xl px-3 py-2 text-sm font-medium",
          nodeHeaderClass(node.kind)
        )}
      >
        <HeaderIcon className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        {node.title}
      </div>
      <div className="space-y-2 px-3 py-3">
        <p className="text-xs font-medium text-foreground">{node.subtitle}</p>
        {node.body ? (
          <p className="text-xs italic leading-relaxed text-muted-foreground line-clamp-3">
            {node.body}
          </p>
        ) : null}
        {node.email ? (
          <span className="inline-flex max-w-full items-center truncate rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px] text-foreground">
            {node.email}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Connector({ succeeded }: { succeeded?: boolean }) {
  return (
    <div className="flex w-10 shrink-0 items-center self-center" aria-hidden>
      <div
        className={cn(
          "h-0.5 w-full rounded-full",
          succeeded
            ? "bg-[var(--status-running-fg)]"
            : "bg-border"
        )}
      />
    </div>
  );
}

export default function WingzWorkflowEditorPage() {
  const [params, setParams] = useSearchParams();
  const sceneParam = params.get("scene") as WorkflowScene | null;
  const scene: WorkflowScene = WORKFLOW_SCENES.includes(
    sceneParam as WorkflowScene
  )
    ? (sceneParam as WorkflowScene)
    : "draft";
  const scenario = WORKFLOW_EDITOR_SCENARIOS[scene];
  const [draft, setDraft] = useState("");

  const setScene = (next: WorkflowScene) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("scene", next);
    setParams(nextParams, { replace: true });
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-canvas">
      {scenario.banner ? (
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-2 border-b px-4 py-2 text-center text-sm",
            scenario.banner.tone === "warning"
              ? "border-border bg-muted/60 text-foreground"
              : "border-border bg-[var(--info-bg)] text-[var(--info-fg)]"
          )}
        >
          <span>{scenario.banner.message}</span>
          {scenario.banner.action ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 font-medium underline-offset-2 hover:underline"
              onClick={() => setScene("draft")}
            >
              <AlignLeft className="size-3.5" strokeWidth={1.75} aria-hidden />
              {scenario.banner.action}
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="relative flex min-h-0 flex-1">
        {/* AI chat column */}
        {scenario.showChat ? (
          <aside className="flex w-[360px] shrink-0 flex-col border-r border-border bg-background">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {scenario.chat.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[90%] rounded-2xl rounded-br-md bg-muted px-3.5 py-2.5 text-sm text-foreground">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="space-y-3">
                    <p className="text-sm leading-relaxed text-foreground">
                      {msg.text}
                    </p>
                    {msg.details ? (
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {msg.details.map((d) => (
                          <li key={d.label}>
                            <span className="font-medium text-foreground">
                              {d.label}:
                            </span>{" "}
                            {d.value}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {msg.card ? (
                      <div className="rounded-lg border border-border bg-muted/40 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {msg.card.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {msg.card.tag}
                            </p>
                          </div>
                          {msg.card.status ? (
                            <Badge
                              tone="green"
                              fill="light"
                              size="sm"
                              variant="pill"
                            >
                              {msg.card.status}
                            </Badge>
                          ) : null}
                        </div>
                        {msg.card.actionLabel ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-3 h-8"
                          >
                            {msg.card.actionLabel}
                          </Button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                )
              )}
            </div>

            <div className="shrink-0 border-t border-border p-3">
              <div className="rounded-xl border border-border bg-background p-2 shadow-sm">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask anything about your workflows…"
                  className="min-h-[72px] resize-none border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0"
                />
                <div className="mt-1 flex items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Add"
                    >
                      <Plus className="size-4" />
                    </Button>
                    <Badge tone="neutral" fill="light" size="sm">
                      Thinking
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Voice"
                    >
                      <Mic className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      className="size-8"
                      aria-label="Send"
                    >
                      <SendHorizontal className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <p className="mt-2 px-1 text-[11px] text-muted-foreground">
                Tip: ask Wingz to add a Slack step or change the schedule.
              </p>
            </div>
          </aside>
        ) : null}

        {/* Canvas */}
        <section className="relative min-w-0 flex-1 overflow-hidden bg-muted/30">
          {/* Dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--border) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
            aria-hidden
          />

          {/* Toolbox */}
          <div className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1 rounded-xl border border-border bg-background p-1.5 shadow-sm">
            {TOOLBOX.map(({ icon: Icon, label }) => (
              <Button
                key={label}
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                aria-label={label}
                title={label}
              >
                <Icon className="size-4" strokeWidth={1.75} />
              </Button>
            ))}
          </div>

          <div className="absolute right-4 top-4 z-10">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-9 bg-background shadow-sm"
              aria-label="Canvas settings"
            >
              <Settings className="size-4" />
            </Button>
          </div>

          <div className="relative flex h-full items-center justify-center px-20 py-10">
            <div className="flex items-stretch">
              {scenario.nodes.map((node, i) => (
                <div key={node.id} className="flex items-center">
                  {i > 0 ? (
                    <Connector succeeded={scenario.edgesSucceeded} />
                  ) : null}
                  <NodeCard node={node} />
                </div>
              ))}
            </div>
          </div>

          {/* Zoom */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 rounded-xl border border-border bg-background p-1 shadow-sm">
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Zoom in">
              <Plus className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Zoom out">
              <Minus className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Fit">
              <Maximize2 className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Lock">
              <Lock className="size-4" />
            </Button>
          </div>

          {/* Minimap */}
          <div className="absolute bottom-4 right-4 z-10 h-24 w-36 overflow-hidden rounded-lg border border-border bg-background p-2 shadow-sm">
            <div className="flex h-full items-center justify-center gap-1">
              <span className="h-4 w-6 rounded-sm bg-[var(--info-bg)]" />
              <span className="h-px w-3 bg-border" />
              <span className="h-5 w-7 rounded-sm bg-muted" />
              <span className="h-px w-3 bg-border" />
              <span className="h-4 w-6 rounded-sm bg-[var(--status-draft-bg)]" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
