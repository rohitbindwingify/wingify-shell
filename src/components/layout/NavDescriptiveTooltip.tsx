// @summary Mixpanel-style nav hover: title + short description, arrow to the trigger.
import type { CSSProperties, ReactElement, ReactNode } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export const navDescriptiveTooltipClass = cn(
  "relative z-[60] max-w-[220px] rounded-lg border border-border bg-background px-3 py-2.5 text-foreground shadow-lg",
  "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
);

export function NavDescriptiveTooltipBody({
  title,
  description,
  trailing,
}: {
  title?: string;
  description: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="min-w-0 flex-1">
        {title ? (
          <p className="text-sm font-semibold leading-snug tracking-tight">
            {title}
          </p>
        ) : null}
        <p
          className={cn(
            "text-xs leading-snug text-muted-foreground",
            title && "mt-0.5"
          )}
        >
          {description}
        </p>
      </div>
      {trailing}
    </div>
  );
}

/** Nudge the fill arrow into the bubble (margin, not transform — Radix owns transform). */
function fillArrowOverlap(side: "top" | "right" | "bottom" | "left"): CSSProperties {
  switch (side) {
    case "right":
      return { marginLeft: 1 };
    case "left":
      return { marginLeft: -1 };
    case "bottom":
      return { marginTop: 1 };
    case "top":
      return { marginTop: -1 };
  }
}

/** Masks the 1px content border where the arrow attaches. */
function BorderMask({ side }: { side: "top" | "right" | "bottom" | "left" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-[1] bg-background",
        side === "right" &&
          "left-0 top-1/2 h-3.5 w-[2px] -translate-x-[1px] -translate-y-1/2",
        side === "left" &&
          "right-0 top-1/2 h-3.5 w-[2px] translate-x-[1px] -translate-y-1/2",
        side === "bottom" &&
          "left-1/2 top-0 h-[2px] w-3.5 -translate-x-1/2 -translate-y-[1px]",
        side === "top" &&
          "bottom-0 left-1/2 h-[2px] w-3.5 -translate-x-1/2 translate-y-[1px]"
      )}
    />
  );
}

/** Wraps a trigger with a title + description tooltip (skips when no description). */
export default function NavDescriptiveTooltip({
  title,
  description,
  children,
  trailing,
  side = "right",
  sideOffset = 8,
  openDelay = 200,
}: {
  title?: string;
  description: string | undefined;
  children: ReactElement;
  trailing?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  openDelay?: number;
}) {
  if (!description) return children;

  return (
    <Tooltip.Root delayDuration={openDelay}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={sideOffset}
          collisionPadding={8}
          className={navDescriptiveTooltipClass}
        >
          <NavDescriptiveTooltipBody
            title={title}
            description={description}
            trailing={trailing}
          />
          <BorderMask side={side} />
          {/* Larger border-colored arrow behind; smaller fill on top = outlined triangle. */}
          <Tooltip.Arrow width={14} height={8} className="fill-border" />
          <Tooltip.Arrow
            width={12}
            height={7}
            className="relative z-[1] fill-background"
            style={fillArrowOverlap(side)}
          />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
