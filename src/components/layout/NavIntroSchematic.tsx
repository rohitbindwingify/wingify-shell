// @summary The illustration in the navigation intro modal, in two states.
// "after" is a real screenshot of the shell (see scripts/capture-nav.mjs),
// shown at 1:1 and cropped by the frame so the labels stay readable; "before"
// is drawn, because the previous navigation no longer exists to photograph.
// Callouts mark what moved. Decorative throughout — the frame is aria-hidden.
import type { ReactNode } from "react";
import type { NavIntroFocus } from "@/config/navIntro";
import { useThemeStore } from "@/store/theme";
import { cn } from "@/lib/utils";

/**
 * Offsets measured from the running shell at the capture viewport. The shot is
 * placed at natural size, so these are plain CSS pixels into the image.
 * Re-measure if the nav's spacing changes and the capture is retaken.
 */
const NAV_WIDTH = 240;
const HEADER_HEIGHT = 56;
/** Rows: Home 90, Home group ends ~270, Experimentation 355, Plan 697. */
const REGION_BOXES: Record<Exclude<NavIntroFocus, "shell">, {
  top: number;
  left: number;
  width: number;
  height: number;
}> = {
  breadcrumb: { top: 0, left: NAV_WIDTH, width: 420, height: HEADER_HEIGHT },
  panel: { top: 70, left: 8, width: NAV_WIDTH - 16, height: 202 },
  rail: { top: 330, left: 8, width: NAV_WIDTH - 16, height: 292 },
  // The pin control itself (22px at x=192 on the Experimentation row), padded
  // so the ring does not sit flush against the icon.
  more: { top: 339, left: 187, width: 32, height: 32 },
};

export type NavIntroMode = "before" | "after";

type Callout = {
  /** Which region it marks; matched against the hovered focus for emphasis. */
  focus: NavIntroFocus;
  label: string;
  top: string;
  left?: string;
  right?: string;
};

const AFTER_CALLOUTS: Callout[] = [
  // Anchored to the screenshot: each dot sits on the edge of the row it marks.
  { focus: "breadcrumb", label: "Account and trail, together", top: "66px", left: "252px" },
  { focus: "panel", label: "Pages grouped by product", top: "160px", left: "244px" },
  { focus: "more", label: "Pin or unpin, right here", top: "340px", left: "244px" },
  { focus: "rail", label: "Every product, side by side", top: "462px", left: "244px" },
];

const BEFORE_CALLOUTS: Callout[] = [
  { focus: "shell", label: "Account stranded in the corner", top: "76px", right: "12px" },
  { focus: "shell", label: "One long list, no grouping", top: "200px", left: "244px" },
  { focus: "shell", label: "Settings and help at the far end", top: "400px", left: "244px" },
];

function Zone({
  lit,
  ringed,
  className,
  children,
}: {
  lit: boolean;
  ringed: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative transition-all duration-500 ease-out motion-reduce:transition-none",
        lit ? "opacity-100" : "opacity-30",
        ringed &&
          "z-10 rounded-[0.3rem] ring-1 ring-foreground/40 ring-offset-1 ring-offset-background",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Dot on the region, short stub, then the label. */
function CalloutChip({
  callout,
  dimmed,
  emphasised,
}: {
  callout: Callout;
  dimmed: boolean;
  emphasised: boolean;
}) {
  const stubFirst = callout.left !== undefined;

  const marker = (
    <>
      <span
        className={cn(
          "size-1 shrink-0 rounded-full",
          emphasised ? "bg-foreground" : "bg-foreground/45"
        )}
      />
      <span
        className={cn(
          "h-px w-2 shrink-0",
          emphasised ? "bg-foreground/60" : "bg-foreground/30"
        )}
      />
    </>
  );

  return (
    <div
      className={cn(
        "absolute z-20 flex items-center gap-1 transition-opacity duration-300 motion-reduce:transition-none",
        dimmed ? "opacity-25" : "opacity-100"
      )}
      style={{ top: callout.top, left: callout.left, right: callout.right }}
    >
      {stubFirst ? marker : null}
      <span
        className={cn(
          "whitespace-nowrap rounded-md border bg-background px-1.5 py-1 text-[0.625rem] font-medium leading-none shadow-sm transition-colors duration-300 motion-reduce:transition-none",
          emphasised
            ? "border-foreground/35 text-foreground"
            : "border-border text-muted-foreground"
        )}
      >
        {callout.label}
      </span>
      {stubFirst ? null : (
        <div className="flex flex-row-reverse items-center gap-1">{marker}</div>
      )}
    </div>
  );
}

/** Report canvas — inert on purpose, the nav is the subject. */
function Canvas({ lit }: { lit: boolean }) {
  return (
    <Zone lit={lit} ringed={false} className="flex flex-1 flex-col gap-2.5 p-3">
      <span className="block h-2 w-16 shrink-0 rounded-full bg-foreground/30" />
      <div className="min-h-0 flex-1 rounded-md border border-border-subtle bg-muted/60" />
      <div className="grid h-10 shrink-0 grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block rounded-md border border-border-subtle bg-muted/60"
          />
        ))}
      </div>
    </Zone>
  );
}

function AfterShell({ focus }: { focus: NavIntroFocus }) {
  const colorMode = useThemeStore((s) => s.colorMode);
  const theme = colorMode === "dark" ? "dark" : "light";
  const src = `/nav-intro/shell-${theme}.png`;
  const pinSrc = `/nav-intro/shell-pin-${theme}.png`;
  const region = focus === "shell" ? null : REGION_BOXES[focus];

  return (
    <>
      {/* Natural size, pinned top-left: the frame crops it, so nothing scales
          down and the real labels stay legible. */}
      <img
        key={src}
        src={src}
        alt=""
        width={1440}
        height={900}
        className="absolute left-0 top-0 max-w-none animate-in fade-in duration-300 motion-reduce:animate-none"
      />

      {/* The pin control is opacity-0 until a row is hovered, so it lives in its
          own capture. Both are mounted and cross-faded — swapping src would
          flash on first reveal. */}
      <img
        src={pinSrc}
        alt=""
        width={1440}
        height={900}
        className={cn(
          "absolute left-0 top-0 max-w-none transition-opacity duration-300 motion-reduce:transition-none",
          focus === "more" ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Calm the report canvas so the callouts read against a quiet field. The
          nav and the breadcrumb stay untouched — they are the subject. */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 bg-background/85"
        style={{ left: NAV_WIDTH, top: HEADER_HEIGHT }}
      />

      {/* Spotlight: the ring's huge spread shadow dims everything outside it. */}
      {region ? (
        <div
          className="pointer-events-none absolute z-10 rounded-md ring-1 ring-foreground/45 shadow-[0_0_0_9999px_color-mix(in_srgb,var(--background)_72%,transparent)] transition-all duration-300 motion-reduce:transition-none"
          style={{
            top: region.top,
            left: region.left,
            width: region.width,
            height: region.height,
          }}
        />
      ) : null}
    </>
  );
}

function BeforeShell() {
  // Drawn at the same scale as the screenshot opposite (240px column, 36px
  // rows), so Before and After are a fair comparison rather than two sizes.
  // Sized to the 34rem frame: 8 rows plus a 4-row footer fill the column
  // without overflowing, so the stranded footer stays visible.
  const rows = ["w-24", "w-16", "w-28", "w-20", "w-24", "w-14", "w-28", "w-20"];
  const footerRows = ["w-20", "w-24", "w-16", "w-20"];

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Account controls, off in the far corner */}
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border-subtle bg-background px-4">
        <span className="h-3 w-16 rounded-full bg-foreground/[0.18]" />
        <span className="ml-auto h-5 w-24 rounded-full bg-foreground/[0.12]" />
        <span className="h-5 w-14 rounded-full bg-foreground/[0.12]" />
        <span className="size-5 rounded-full bg-foreground/20" />
      </div>

      <div className="flex min-h-0 flex-1">
        {/* One flat list, utility rows stranded at the foot of it */}
        <div className="flex w-60 shrink-0 flex-col border-r border-border-subtle bg-muted px-4 py-4">
          {rows.map((width, i) => (
            <div key={i} className="flex h-9 items-center gap-3">
              <span className="size-4 shrink-0 rounded bg-foreground/[0.16]" />
              <span
                className={cn(
                  "h-2 rounded-full",
                  i === 1 ? "bg-foreground/45" : "bg-foreground/[0.16]",
                  width
                )}
              />
            </div>
          ))}
          <div className="mt-auto">
            {footerRows.map((width, i) => (
              <div key={i} className="flex h-9 items-center gap-3">
                <span className="size-4 shrink-0 rounded bg-foreground/[0.16]" />
                <span className={cn("h-2 rounded-full bg-foreground/[0.16]", width)} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col bg-background">
          <Canvas lit />
        </div>
      </div>
    </div>
  );
}

export default function NavIntroSchematic({
  focus,
  mode,
  className,
}: {
  focus: NavIntroFocus;
  mode: NavIntroMode;
  className?: string;
}) {
  const callouts = mode === "after" ? AFTER_CALLOUTS : BEFORE_CALLOUTS;
  const hovering = mode === "after" && focus !== "shell";

  return (
    <div
      aria-hidden
      className={cn(
        // No height here on purpose: the caller sizes the frame, and a fixed
        // height would beat any aspect-ratio class passed in.
        "relative overflow-hidden rounded-xl border border-border bg-muted",
        className
      )}
    >
      {mode === "after" ? <AfterShell focus={focus} /> : <BeforeShell />}

      {callouts.map((callout) => (
        <CalloutChip
          key={callout.label}
          callout={callout}
          dimmed={hovering && callout.focus !== focus}
          emphasised={hovering && callout.focus === focus}
        />
      ))}
    </div>
  );
}
