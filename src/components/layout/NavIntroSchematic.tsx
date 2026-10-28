// @summary Annotated shell for the nav intro: real nav photo + skeleton body +
// callout cards with curved leaders. Decorative; the frame is aria-hidden.
import { NAV_INTRO_POINTS, type NavIntroTone } from "@/config/navIntro";
import { cn } from "@/lib/utils";

const TONE: Record<
  NavIntroTone,
  { bg: string; border: string; fg: string; line: string }
> = {
  amber: {
    bg: "var(--chart-warning-bg)",
    border: "var(--chart-warning)",
    fg: "var(--chart-warning)",
    line: "var(--chart-warning)",
  },
  ocean: {
    bg: "var(--report-blue-bg)",
    border: "var(--report-blue-border)",
    fg: "var(--report-blue-fg)",
    line: "var(--chart-info)",
  },
  green: {
    bg: "var(--status-running-bg)",
    border: "var(--status-running-fg)",
    fg: "var(--status-running-fg)",
    line: "var(--status-running-fg)",
  },
  berry: {
    bg: "var(--report-purple-bg)",
    border: "var(--report-purple-border)",
    fg: "var(--report-purple-fg)",
    line: "var(--report-purple-fg)",
  },
};

/**
 * Callout cards sit in the body column; anchors sit on the nav.
 * Positions are % of the full frame (nav ~27% wide). Paths use a 100×100 viewBox.
 */
const CALLOUT_LAYOUT: Record<
  string,
  {
    cardTop: string;
    anchorX: string;
    anchorY: string;
    /** Cubic from near the card’s left edge to the anchor. */
    path: string;
  }
> = {
  breadcrumb: {
    cardTop: "5%",
    anchorX: "34%",
    anchorY: "5%",
    path: "M 46 9 C 40 9, 36 7, 34 5",
  },
  rail: {
    cardTop: "22%",
    anchorX: "13%",
    anchorY: "30%",
    path: "M 46 28 C 34 28, 22 30, 13 30",
  },
  more: {
    cardTop: "46%",
    anchorX: "22%",
    anchorY: "52%",
    path: "M 46 52 C 36 52, 28 52, 22 52",
  },
  panel: {
    cardTop: "68%",
    anchorX: "13%",
    anchorY: "64%",
    path: "M 46 74 C 34 74, 22 68, 13 64",
  },
};

function SkeletonBody() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 bg-canvas p-4">
      {/* Breadcrumb chrome */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="h-2 w-20 rounded-full bg-foreground/15" />
        <span className="text-[10px] text-muted-foreground">/</span>
        <span className="h-2 w-10 rounded-full bg-foreground/15" />
        <span className="text-[10px] text-muted-foreground">/</span>
        <span className="h-2 w-16 rounded-full bg-foreground/25" />
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-3">
        <div className="h-16 rounded-lg border border-border bg-background p-3 shadow-sm">
          <span className="mb-2 block h-2 w-16 rounded-full bg-foreground/15" />
          <span className="block h-5 w-12 rounded-md bg-muted" />
        </div>
        <div className="h-16 rounded-lg border border-border bg-background p-3 shadow-sm">
          <span className="mb-2 block h-2 w-20 rounded-full bg-foreground/15" />
          <span className="block h-5 w-14 rounded-md bg-muted" />
        </div>
      </div>

      <div className="flex min-h-0 flex-[1.2] flex-col rounded-lg border border-border bg-background p-3 shadow-sm">
        <span className="mb-3 h-2.5 w-24 rounded-full bg-foreground/20" />
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-md bg-muted/50">
          <svg
            viewBox="0 0 320 120"
            className="absolute inset-0 size-full text-foreground/20"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0,90 C40,70 70,95 110,60 C150,25 180,55 220,40 C260,25 290,50 320,35 L320,120 L0,120 Z"
              fill="currentColor"
              fillOpacity="0.18"
            />
            <path
              d="M0,90 C40,70 70,95 110,60 C150,25 180,55 220,40 C260,25 290,50 320,35"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-lg border border-border bg-background p-3 shadow-sm">
        <span className="h-2.5 w-20 rounded-full bg-foreground/20" />
        {[0.55, 0.7, 0.45, 0.62, 0.5].map((w, i) => (
          <span
            key={i}
            className="h-2 rounded-full bg-foreground/10"
            style={{ width: `${w * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function CalloutCard({
  title,
  description,
  tone,
  top,
}: {
  title: string;
  description: string;
  tone: NavIntroTone;
  top: string;
}) {
  const t = TONE[tone];
  return (
    <div
      className="absolute z-20 w-[min(15.5rem,46%)] rounded-lg border px-3 py-2.5 shadow-sm"
      style={{
        top,
        left: "48%",
        background: t.bg,
        borderColor: `color-mix(in srgb, ${t.border} 45%, transparent)`,
      }}
    >
      <p className="text-[0.8125rem] font-semibold leading-snug" style={{ color: t.fg }}>
        {title}
      </p>
      <p className="mt-1 text-[0.6875rem] leading-relaxed text-foreground/70">
        {description}
      </p>
    </div>
  );
}

export default function NavIntroSchematic({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex overflow-hidden rounded-xl border border-border bg-muted",
        className
      )}
    >
      {/* Nav from product photo */}
      <div className="relative h-full w-[27%] shrink-0 overflow-hidden border-r border-border bg-background">
        <img
          src="/nav-intro/shell-new.png"
          alt=""
          width={995}
          height={1024}
          className="absolute left-0 top-0 h-full w-auto max-w-none"
        />
        {/* Pin affordance highlight */}
        <span
          className="absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: "82%",
            top: "52%",
            background:
              "color-mix(in srgb, var(--status-running-fg) 18%, transparent)",
            boxShadow:
              "0 0 0 1px color-mix(in srgb, var(--status-running-fg) 35%, transparent)",
          }}
        />
      </div>

      <div className="relative min-h-0 min-w-0 flex-1">
        <SkeletonBody />
      </div>

      {/* Leaders (viewBox % space) */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible"
        aria-hidden
      >
        {NAV_INTRO_POINTS.map((point) => {
          const layout = CALLOUT_LAYOUT[point.id];
          if (!layout) return null;
          const t = TONE[point.tone];
          return (
            <path
              key={point.id}
              d={layout.path}
              fill="none"
              stroke={t.line}
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* Anchor dots stay circular (HTML, not stretched with the SVG). */}
      {NAV_INTRO_POINTS.map((point) => {
        const layout = CALLOUT_LAYOUT[point.id];
        if (!layout) return null;
        const t = TONE[point.tone];
        return (
          <span
            key={`${point.id}-dot`}
            className="absolute z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-[3px]"
            style={{
              left: layout.anchorX,
              top: layout.anchorY,
              background: t.line,
              boxShadow: `0 0 0 1px color-mix(in srgb, ${t.line} 40%, transparent)`,
              // ring via box-shadow; ring color
              outline: `3px solid color-mix(in srgb, ${t.line} 22%, transparent)`,
            }}
          />
        );
      })}

      {NAV_INTRO_POINTS.map((point) => {
        const layout = CALLOUT_LAYOUT[point.id];
        if (!layout) return null;
        return (
          <CalloutCard
            key={point.id}
            title={point.title}
            description={point.description}
            tone={point.tone}
            top={layout.cardTop}
          />
        );
      })}
    </div>
  );
}
