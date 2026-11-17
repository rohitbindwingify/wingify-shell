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
}: {
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** hover = open on mouse enter; click = open only from the trigger. */
  openMode?: "hover" | "click";
}) {
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<HelpMrrTier>("enterprise");
  const closeTimer = useRef<number | undefined>(undefined);
  const clickMode = openMode === "click";

  useEffect(() => {
    return () => window.clearTimeout(closeTimer.current);
  }, []);

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    if (clickMode) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), HOVER_CLOSE_MS);
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
              setOpen(true);
            }
      }
      onMouseLeave={clickMode ? undefined : scheduleClose}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          sideOffset={10}
          collisionPadding={12}
          onMouseEnter={clickMode ? undefined : cancelClose}
          onMouseLeave={clickMode ? undefined : scheduleClose}
          className="z-50 w-auto max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-border bg-popover p-0 text-popover-foreground shadow-lg"
        >
          <HelpPanel
            profile={HELP_SUPPORT[tier]}
            onPreviewTier={setTier}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
