/** Detail header — leading overflow crumb. Hover shows everything before the last two trail segments. */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { MoreHorizontal } from "@/components/icons/protoLucide";
import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useIsGetStartedLocked } from "@/store/getStartedOnboarding";
import { ProductCrumb } from "./CrumbSwitchers";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

const OPEN_MS = 120;
const CLOSE_MS = 220;

export type OverflowCrumb = { label: string; to: string };

type Props = {
  /** Collapsed product node (opens product switcher). */
  product?: NavItem;
  /** Extra plain links after workspace / product (e.g. analytics list crumb). */
  earlier?: OverflowCrumb[];
};

export default function DetailCrumbOverflow({ product, earlier = [] }: Props) {
  const navLocked = useIsGetStartedLocked();
  const [open, setOpen] = useState(false);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  /** Nested menus portal outside this popover — keep overflow open while any are open. */
  const nestedCountRef = useRef(0);

  useEffect(() => {
    return () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  const nestedOpen = () => nestedCountRef.current > 0;

  const scheduleOpen = () => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setOpen(true), OPEN_MS);
  };

  const scheduleClose = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      if (nestedOpen()) return;
      setOpen(false);
    }, CLOSE_MS);
  };

  const handleNestedOpenChange = (next: boolean) => {
    nestedCountRef.current = Math.max(
      0,
      nestedCountRef.current + (next ? 1 : -1)
    );
    if (nestedOpen()) {
      window.clearTimeout(closeTimer.current);
      setOpen(true);
      return;
    }
    // Last nested menu closed — dismiss overflow unless pointer is still over it.
    scheduleClose();
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && nestedOpen()) return;
        setOpen(next);
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Show earlier path"
          title="Show earlier path"
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
          onFocus={scheduleOpen}
          onBlur={scheduleClose}
          className={cn(
            "inline-flex h-7 shrink-0 items-center justify-center rounded-md px-1 text-muted-foreground outline-none transition-colors",
            "hover:bg-muted/60 hover:text-foreground focus-visible:bg-muted/60 focus-visible:text-foreground",
            open && "text-foreground"
          )}
        >
          <MoreHorizontal className="size-3.5" strokeWidth={1.75} aria-hidden />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (nestedOpen()) e.preventDefault();
          }}
          className="z-50 rounded-md border border-border bg-popover p-1.5 text-sm text-popover-foreground shadow-lg outline-none"
        >
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <WorkspaceSwitcher
              compact
              tone="muted"
              onOpenChange={handleNestedOpenChange}
            />
            {product ? (
              <>
                <span className="shrink-0 text-muted-foreground" aria-hidden>
                  /
                </span>
                <ProductCrumb
                  item={product}
                  locked={navLocked}
                  tone="muted"
                  onOpenChange={handleNestedOpenChange}
                />
              </>
            ) : null}
            {earlier.map((crumb) => (
              <span key={crumb.to} className="contents">
                <span className="shrink-0 text-muted-foreground" aria-hidden>
                  /
                </span>
                <Link
                  to={crumb.to}
                  title={crumb.label}
                  className="max-w-[10rem] truncate rounded-md px-1 py-0.5 font-normal text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted"
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
