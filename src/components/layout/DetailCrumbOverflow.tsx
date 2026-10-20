/** Detail header — leading overflow crumb. Hover shows everything before the last two trail segments. */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { Home, MoreHorizontal } from "@/components/icons/protoLucide";
import type { NavItem } from "@/config/navigation";
import { GET_STARTED_PATH } from "@/lib/getStartedGate";
import { cn } from "@/lib/utils";
import { useIsGetStartedLocked } from "@/store/getStartedOnboarding";
import { useIsGetStartedWorkspace } from "@/store/workspace";
import { ProductCrumb } from "./CrumbSwitchers";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

const OPEN_MS = 120;
const CLOSE_MS = 220;

export type OverflowCrumb = { label: string; to: string };

type Props = {
  /** Collapsed product node (opens product switcher). */
  product?: NavItem;
  /** Extra plain links after workspace / product (e.g. analytics list). */
  earlier?: OverflowCrumb[];
};

export default function DetailCrumbOverflow({ product, earlier = [] }: Props) {
  const getStarted = useIsGetStartedWorkspace();
  const navLocked = useIsGetStartedLocked();
  const homePath = getStarted ? GET_STARTED_PATH : "/home/dashboard";
  const [open, setOpen] = useState(false);
  const openTimer = useRef<number>();
  const closeTimer = useRef<number>();

  useEffect(() => {
    return () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  const scheduleOpen = () => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setOpen(true), OPEN_MS);
  };

  const scheduleClose = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_MS);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
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
          className="z-50 rounded-md border border-border bg-popover p-1.5 text-sm text-popover-foreground shadow-lg outline-none"
        >
          <div className="flex flex-wrap items-center gap-1">
            <Link
              to={homePath}
              aria-label="Home"
              title="Home"
              className="inline-flex items-center justify-center rounded-md px-1.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Home className="size-3.5" strokeWidth={1.75} aria-hidden />
            </Link>
            <span className="px-0.5 text-muted-foreground" aria-hidden>
              /
            </span>
            <WorkspaceSwitcher />
            {product ? (
              <>
                <span className="px-0.5 text-muted-foreground" aria-hidden>
                  /
                </span>
                <ProductCrumb item={product} locked={navLocked} tone="muted" />
              </>
            ) : null}
            {earlier.map((crumb) => (
              <span key={crumb.to} className="contents">
                <span className="px-0.5 text-muted-foreground" aria-hidden>
                  /
                </span>
                <Link
                  to={crumb.to}
                  title={crumb.label}
                  className="max-w-[12rem] truncate rounded-md px-1.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
