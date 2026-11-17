/** Prototype — MSG91-style overview, ordered for AI agents first. Not in nav. */

import { useState, type ReactNode } from "react";
import {
  Bot,
  Check,
  Copy,
  Lock,
  Layers,
  List,
  Plug,
  Sparkles,
  Link2,
  Monitor,
  BookOpen,
  ArrowRight,
} from "@/components/icons/protoLucide";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const NAV = [
  {
    label: "AI builders",
    items: [
      { id: "overview", label: "Overview" },
      { id: "prompt", label: "Starter prompt" },
      { id: "use-cases", label: "Use cases" },
      { id: "mcp", label: "Connect MCP" },
      { id: "tools", label: "Tool catalog" },
      { id: "flow", label: "Agent loop" },
    ],
  },
  {
    label: "Developers",
    items: [
      { id: "configure", label: "Configure" },
      { id: "api", label: "API reference" },
      { id: "sdk", label: "Terminal" },
      { id: "resources", label: "Resources" },
    ],
  },
] as const;

const API_BASE = "https://app.wingify.com/api/v2";

const STARTER_PROMPT = `You are calling the Wingify REST API.
Base URL: ${API_BASE}
Docs: https://developers.wingify.com

Auth: put the API token in the request header named token. A wrong token, or a token in the body, returns Authentication Failed. Tokens are created at https://app.wingify.com/#/developers/tokens

Goal: confirm the current workspace, then list its campaigns.

Steps:
1. GET /accounts/current with the token header.
2. GET /accounts/current/campaigns?limit=25&offset=0
3. Show the status code, the request, and id, name, and status from the JSON body.
4. Stop. Do not create or change a campaign.`;

const USE_CASES: {
  label: string;
  solution: string;
  prompt: string;
  icon: typeof Plug;
}[] = [
  {
    label: "Current workspace",
    solution: "GET /accounts/current",
    prompt:
      "GET https://app.wingify.com/api/v2/accounts/current with my token in the token header. Print the workspace JSON. Do not write anything.",
    icon: Lock,
  },
  {
    label: "List workspaces",
    solution: "GET /accounts",
    prompt:
      "GET /accounts?includeCurrent=true&status=active. Return each workspace id and name.",
    icon: Layers,
  },
  {
    label: "List campaigns",
    solution: "GET /accounts/current/campaigns",
    prompt:
      "GET /accounts/current/campaigns?limit=25&offset=0&platform=website. Return id, name, and status. Do not create a campaign.",
    icon: List,
  },
  {
    label: "Campaign details",
    solution: "GET /accounts/current/campaigns/{id}",
    prompt:
      "GET /accounts/current/campaigns/7 and print the campaign JSON the API returns.",
    icon: BookOpen,
  },
  {
    label: "Share link",
    solution: "GET /accounts/current/campaigns/{id}/share",
    prompt:
      "GET /accounts/current/campaigns/7/share and return the share link from the response.",
    icon: Link2,
  },
];

const MCP_INSTALL = `npx -y @wingify/mcp-server init`;

const MCP_CURSOR = `{
  "mcpServers": {
    "wingify": {
      "command": "npx",
      "args": ["-y", "@wingify/mcp-server"],
      "env": {
        "WINGIFY_API_TOKEN": "YOUR_TOKEN"
      }
    }
  }
}`;

const AGENT_TOOLS = [
  { name: "GET /accounts/current", desc: "Retrieve the current workspace" },
  { name: "GET /accounts", desc: "List workspaces (includeCurrent, status)" },
  { name: "GET /accounts/current/campaigns", desc: "List campaigns (limit, offset, platform, type)" },
  { name: "GET /accounts/current/campaigns/{id}", desc: "Campaign details" },
  { name: "GET .../campaigns/{id}/variations", desc: "List variations on a campaign" },
  { name: "POST .../campaigns/{id}/variations", desc: "Create a variation" },
  { name: "GET .../campaigns/{id}/share", desc: "Share link for a campaign" },
  { name: "PATCH .../campaigns/status", desc: "Set RUNNING, PAUSED, STOPPED, TRASHED, or RESTORED" },
];

const API_DOCS = [
  {
    label: "Introduction",
    href: "https://developers.wingify.com/reference/introduction-1",
  },
  {
    label: "Authentication",
    href: "https://developers.wingify.com/reference/authentication",
  },
  {
    label: "Request types",
    href: "https://developers.wingify.com/reference/request-types-1",
  },
  {
    label: "Campaigns",
    href: "https://developers.wingify.com/reference/campaigns",
  },
  {
    label: "List campaigns",
    href: "https://developers.wingify.com/reference/get-the-campaigns-of-an-account",
  },
  {
    label: "Campaign details",
    href: "https://developers.wingify.com/reference/get-details-of-a-specific-campaign",
  },
];

const DEV_CHANNELS = [
  {
    title: "Base URL",
    body: "https://app.wingify.com/api/v2 — JSON in, JSON out.",
  },
  {
    title: "Token header",
    body: "Send the API token in the header named token. Generate it under Developers → Tokens.",
  },
  {
    title: "Workspace",
    body: "Use account id current for the main workspace, or a numeric workspace id.",
  },
  {
    title: "Writes",
    body: "POST and PATCH send Content-Type: application/json. DELETE returns 204.",
  },
];

function CopyBlock({
  label,
  value,
  className,
}: {
  label?: string;
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-muted/40",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <span className="truncate text-xs text-muted-foreground">
          {label ?? "Copy"}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={onCopy}
        >
          {copied ? (
            <Check className="size-3.5" strokeWidth={1.75} aria-hidden />
          ) : (
            <Copy className="size-3.5" strokeWidth={1.75} aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-left text-xs leading-relaxed text-foreground">
        <code>{value}</code>
      </pre>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 space-y-6">
      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="font-title text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function AgentFirstDocsPage() {
  const [activePrompt, setActivePrompt] = useState(STARTER_PROMPT);
  const [activeId, setActiveId] = useState("overview");

  const goTo = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex h-full min-h-0 bg-background text-foreground">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-background">
        <div className="px-5 pb-4 pt-6">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Wingify
          </p>
          <p className="text-xs text-muted-foreground">Agent docs</p>
        </div>
        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 pb-6">
          {NAV.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {group.label}
              </p>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(item.id)}
                  className={cn(
                    "flex w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    activeId === item.id
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <main className="min-h-0 flex-1 overflow-y-auto px-10 py-12">
        <div className="mx-auto w-full max-w-3xl space-y-14">
          {/* Hero */}
          <header id="overview" className="scroll-mt-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral" fill="light" size="sm" variant="pill">
                Prototype
              </Badge>
              <Badge tone="neutral" fill="light" size="sm" variant="pill">
                AI agents first
              </Badge>
            </div>
            <div className="space-y-3">
              <h1 className="font-title text-3xl font-semibold tracking-tight text-foreground">
                Build with Wingify through AI agents
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Prompts for the published Wingify REST API at
                developers.wingify.com. Paste one and the agent calls
                app.wingify.com/api/v2 with your token header.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Try this page at{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                /design/agent-first
              </code>
            </p>
          </header>

          <div className="space-y-14">
              <Section
                id="prompt"
                eyebrow="I. Start with a prompt"
                title="Give this to your AI agent"
              >
                <p className="text-sm text-muted-foreground">
                  These prompts run developer operations. Copy one into Cursor,
                  Claude, or any MCP client and the agent calls the endpoint,
                  then shows the request and response.
                </p>
                <CopyBlock
                  label="Starter prompt — paste into your agent"
                  value={activePrompt}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setActivePrompt(STARTER_PROMPT)}
                  >
                    <Sparkles className="size-3.5" strokeWidth={1.75} />
                    Reset starter
                  </Button>
                </div>
              </Section>

              <Section
                id="use-cases"
                eyebrow="II. Choose an API operation"
                title="Pick an API operation — then copy the prompt"
              >
                <div className="grid gap-3">
                  {USE_CASES.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Card key={item.label} className="shadow-none">
                        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                              <Icon
                                className="size-4 text-foreground"
                                strokeWidth={1.75}
                                aria-hidden
                              />
                            </span>
                            <div className="min-w-0 space-y-1">
                              <p className="text-sm font-medium text-foreground">
                                {item.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Recommended: {item.solution}
                              </p>
                              <p className="pt-1 text-sm text-muted-foreground">
                                &ldquo;{item.prompt}&rdquo;
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                            onClick={() => setActivePrompt(item.prompt)}
                          >
                            Use prompt
                            <ArrowRight
                              className="size-3.5"
                              strokeWidth={1.75}
                            />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </Section>

              <Section
                id="mcp"
                eyebrow="III. Connect MCP"
                title="Expose Wingify as tools for your AI client"
              >
                <p className="text-sm text-muted-foreground">
                  Wingify publishes REST, not an MCP server. This snippet is
                  how an agent would hold the same token the API expects in
                  the token header, then call app.wingify.com/api/v2.
                </p>
                <div className="grid gap-4">
                  <CopyBlock label="Install" value={MCP_INSTALL} />
                  <CopyBlock
                    label="Cursor — mcp.json snippet"
                    value={MCP_CURSOR}
                  />
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-foreground"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    Discover published Wingify tools
                  </li>
                  <li className="flex gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-foreground"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    Call the published account and campaign endpoints
                  </li>
                  <li className="flex gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-foreground"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    Prompt for missing params instead of hunting docs
                  </li>
                </ul>
              </Section>

              <Section
                id="tools"
                eyebrow="IV. Agent tool catalog"
                title="What the agent can call"
              >
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Tool</th>
                        <th className="px-4 py-3 font-medium">What it does</th>
                      </tr>
                    </thead>
                    <tbody>
                      {AGENT_TOOLS.map((tool) => (
                        <tr
                          key={tool.name}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-4 py-3 font-mono text-xs text-foreground">
                            {tool.name}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {tool.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section
                id="flow"
                eyebrow="V. Recommended flow"
                title="Agent-first loop"
              >
                <ol className="grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      n: "1",
                      title: "Prompt",
                      body: "Describe the outcome in plain language.",
                      icon: Sparkles,
                    },
                    {
                      n: "2",
                      title: "Agent acts",
                      body: "MCP tools call the endpoint and return the response.",
                      icon: Bot,
                    },
                    {
                      n: "3",
                      title: "You approve",
                      body: "Check the request and response before the next call.",
                      icon: Plug,
                    },
                  ].map((step) => {
                    const Icon = step.icon;
                    return (
                      <Card key={step.n} className="shadow-none">
                        <CardContent className="space-y-3 p-5">
                          <div className="flex items-center justify-between">
                            <span className="flex size-8 items-center justify-center rounded-md border border-border bg-muted text-xs font-medium">
                              {step.n}
                            </span>
                            <Icon
                              className="size-4 text-muted-foreground"
                              strokeWidth={1.75}
                              aria-hidden
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">
                              {step.title}
                            </p>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {step.body}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </ol>
              </Section>
          </div>

          <div className="space-y-14">
              <Section
                id="configure"
                eyebrow="I. Configure first"
                title="Auth and base URL before the first call"
              >
                <p className="text-sm text-muted-foreground">
                  From the Wingify API reference: every request uses the v2
                  base URL and a token header. account_id current means the
                  main workspace.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DEV_CHANNELS.map((ch) => (
                    <Card key={ch.title} className="shadow-none">
                      <CardContent className="space-y-2 p-5">
                        <p className="text-sm font-medium text-foreground">
                          {ch.title}
                        </p>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {ch.body}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-0 text-xs"
                        >
                          Configure
                          <ArrowRight className="size-3.5" strokeWidth={1.75} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>

              <Section
                id="api"
                eyebrow="II. API reference"
                title="Endpoints when you want the contract"
              >
                <div className="grid gap-2">
                  {API_DOCS.map((doc) => (
                    <a
                      key={doc.href}
                      href={doc.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
                    >
                      <span className="font-medium text-foreground">
                        {doc.label}
                      </span>
                      <ArrowRight
                        className="size-4 text-muted-foreground"
                        strokeWidth={1.75}
                      />
                    </a>
                  ))}
                </div>
              </Section>

              <Section
                id="sdk"
                eyebrow="III. Terminal"
                title="Call it from the terminal"
              >
                <CopyBlock
                  label="List campaigns — token header"
                  value={`curl "${API_BASE}/accounts/current/campaigns?limit=25" \\
  -H "token: YOUR_TOKEN"`}
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  {["GET 200", "POST 201", "PATCH 200", "DELETE 204"].map(
                    (method) => (
                      <Badge
                        key={method}
                        tone="neutral"
                        fill="light"
                        size="sm"
                        variant="pill"
                      >
                        {method}
                      </Badge>
                    )
                  )}
                </div>
              </Section>

              <Section
                id="resources"
                eyebrow="IV. Developer resources"
                title="When the agent is not enough"
              >
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Resource</th>
                        <th className="px-4 py-3 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          r: "API reference",
                          d: "developers.wingify.com — accounts, campaigns, variations",
                        },
                        {
                          r: "Tokens",
                          d: "app.wingify.com/#/developers/tokens",
                        },
                        {
                          r: "Auth",
                          d: "Header name token. Not in the body.",
                        },
                        {
                          r: "Status codes",
                          d: "GET 200, POST 201, PATCH 200, DELETE 204",
                        },
                      ].map((row) => (
                        <tr
                          key={row.r}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-4 py-3 font-medium text-foreground">
                            {row.r}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {row.d}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
          </div>

          <Separator />

          <footer className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                <BookOpen
                  className="size-4 text-foreground"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Docs shaped for agents, usable by developers
                </p>
                <p className="text-xs text-muted-foreground">
                  Prompts call the published v2 REST API. Token stays in the
                  token header.
                </p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-1.5">
              <Monitor className="size-3.5" strokeWidth={1.75} />
              Open MCP install
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}
