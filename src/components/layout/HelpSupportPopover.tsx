// @summary Help popover — read top to bottom: team, then self-serve, then Support.
// Opens from main-nav Need Help? and detail utility-rail Help (same pattern as Activity).
import {
  cloneElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { HelpPanel } from "@/components/ui/help-panel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HELP_SUPPORT, type HelpMrrTier } from "@/data/helpSupport";
import { cn } from "@/lib/utils";

const HOVER_CLOSE_MS = 120;

export default function HelpSupportPopover({
  children,
  side = "right",
  align = "end",
  openMode = "hover",
  onOpenChange,
}: {
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** hover = open on mouse enter; click = open only from the trigger. */
  openMode?: "hover" | "click";
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<HelpMrrTier>("enterprise");
  const closeTimer = useRef<number | undefined>(undefined);
  const clickMode = openMode === "click";

  useEffect(() => {
    return () => window.clearTimeout(closeTimer.current);
  }, []);

  const setOpenBoth = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const scheduleClose = (event?: { relatedTarget: EventTarget | null }) => {
    if (clickMode) return;
    const next = event?.relatedTarget;
    if (next instanceof Element && next.closest("[role='menu']")) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenBoth(false), HOVER_CLOSE_MS);
  };

  const trigger = cloneElement(children, {
    "aria-expanded": open,
    "aria-haspopup": "dialog",
    className: cn(
      (children.props as { className?: string }).className,
      open && "bg-muted hover:bg-muted"
    ),
  } as Partial<typeof children.props> & {
    "aria-expanded": boolean;
    "aria-haspopup": string;
    className: string;
  });

  return (
    <div
      onMouseEnter={
        clickMode
          ? undefined
          : () => {
              cancelClose();
              setOpenBoth(true);
            }
      }
      onMouseLeave={clickMode ? undefined : (event) => scheduleClose(event)}
    >
      <Popover open={open} onOpenChange={setOpenBoth}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          sideOffset={10}
          collisionPadding={12}
          onMouseEnter={clickMode ? undefined : cancelClose}
          onMouseLeave={clickMode ? undefined : (event) => scheduleClose(event)}
          onInteractOutside={(event) => {
            const target = event.target;
            if (target instanceof Element && target.closest("[role='menu']")) {
              event.preventDefault();
            }
          }}
          className="z-50 w-auto max-w-[calc(100vw-1.5rem)] overflow-visible rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-none"
          style={{ boxShadow: "var(--shadow-float)" }}
        >
          <div className="overflow-hidden rounded-xl">
            <HelpPanel
              profile={HELP_SUPPORT[tier]}
              onPreviewTier={setTier}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
