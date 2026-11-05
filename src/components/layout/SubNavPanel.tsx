// Product sub-nav (docked / flyout) — nested accordion leaves, premium
// crown badge, section separators. Sub-leaf leading icons omitted.

import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  ChevronDown,
  Crown,
  ExternalLink,
  EyeOff,
} from "@/components/icons/protoLucide";
import {
  leafLandPath,
  type NavItem,
  type NavLeaf,
} from "../../config/navigation";
import { canUnpinPath, useUIStore } from "../../store/ui";
import { GET_STARTED_PATH } from "@/lib/getStartedGate";
import {
  useGetStartedNavLockTooltip,
  useIsGetStartedLocked,
} from "@/store/getStartedOnboarding";
import { cn } from "../../lib/utils";

const lockTooltipClass =
  "z-50 max-w-[240px] rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md";

/** "Feature Management" → "Feature management" for flyout chrome. */
function toSentenceCase(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return label;
  const lower = trimmed.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function withLockTooltip(node: React.ReactNode, tooltip: string | null) {
  if (!tooltip) return node;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{node}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side="right" sideOffset={8} className={lockTooltipClass}>
          {tooltip}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

type SubNavPanelProps = {
  item: NavItem;
  variant: "docked" | "flyout";
  /** Called after the item is unpinned so a flyout host can dismiss itself. */
  onRequestClose?: () => void;
};

function isUnder(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(path + "/");
}

function leafActive(pathname: string, leaf: NavLeaf): boolean {
  if (leaf.items?.length) {
    return leaf.items.some((child) => leafActive(pathname, child));
  }
  return isUnder(pathname, leaf.path);
}

function activeAccordionPath(
  pathname: string,
  sections: NonNullable<NavItem["sections"]>
): string | null {
  for (const section of sections) {
    for (const leaf of section.items) {
      if (leaf.items?.length && leafActive(pathname, leaf)) return leaf.path;
    }
  }
  return null;
}

function PremiumBadge() {
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
      title="Premium"
      aria-label="Premium"
    >
      <Crown className="size-3" strokeWidth={1.75} aria-hidden />
    </span>
  );
}

function LeafRow({
  leaf,
  onRequestClose,
  nested = false,
  disabled = false,
  lockTooltip = null,
}: {
  leaf: NavLeaf;
  onRequestClose?: () => void;
  nested?: boolean;
  disabled?: boolean;
  lockTooltip?: string | null;
}) {
  const content = (
    <>
      <span className="min-w-0 flex-1 truncate">
        {toSentenceCase(leaf.label)}
      </span>
      {leaf.badge === "premium" && <PremiumBadge />}
      {leaf.external && (
        <ExternalLink
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
    </>
  );

  const leafClass = cn(
    "flex items-center gap-3 rounded-md px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted",
    nested && "py-1"
  );

  const className = ({ isActive }: { isActive: boolean }) =>
    cn(
      leafClass,
      isActive && "bg-accent text-accent-foreground hover:bg-accent"
    );

  if (leaf.external) {
    if (disabled) {
      return withLockTooltip(
        <span
          aria-disabled="true"
          className={cn(leafClass, "cursor-not-allowed opacity-40 hover:bg-transparent")}
        >
          {content}
        </span>,
        lockTooltip
      );
    }
    return (
      <a
        href={leaf.path}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onRequestClose?.()}
        className={leafClass}
      >
        {content}
      </a>
    );
  }

  if (disabled) {
    return withLockTooltip(
      <span
        aria-disabled="true"
        className={cn(leafClass, "cursor-not-allowed opacity-40 hover:bg-transparent")}
      >
        {content}
      </span>,
      lockTooltip
    );
  }

  return (
    <NavLink
      to={leaf.path}
      onClick={() => onRequestClose?.()}
      className={className}
    >
      {content}
    </NavLink>
  );
}

function AccordionLeaf({
  leaf,
  open,
  onToggle,
  onNavigate,
  onRequestClose,
  navLocked = false,
  lockTooltip = null,
}: {
  leaf: NavLeaf;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  onRequestClose?: () => void;
  navLocked?: boolean;
  lockTooltip?: string | null;
}) {
  const { pathname } = useLocation();
  const sectionActive = leafActive(pathname, leaf);

  return (
    <div>
      <div className="group flex items-center gap-1 rounded-md pr-1 transition-colors hover:bg-muted">
        <button
          type="button"
          onClick={() => {
            onToggle();
            if (!open) onNavigate();
          }}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 px-2.5 py-1.5 text-left text-sm font-medium text-foreground outline-none",
            sectionActive && "text-accent-foreground"
          )}
        >
          <span className="min-w-0 flex-1 truncate">
            {toSentenceCase(leaf.label)}
          </span>
          {leaf.badge === "premium" && <PremiumBadge />}
        </button>
        <button
          type="button"
          aria-label={open ? `Collapse ${leaf.label}` : `Expand ${leaf.label}`}
          onClick={onToggle}
          className="shrink-0 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-150",
              open && "rotate-180"
            )}
          />
        </button>
      </div>
      {open && leaf.items && (
        <div className="ml-[18px] mt-0.5 flex flex-col gap-0.5 border-l border-panel-border pb-1 pl-2.5">
          {leaf.items.map((child) => (
            <LeafRow
              key={child.path}
              leaf={child}
              nested
              onRequestClose={onRequestClose}
              disabled={navLocked && child.path !== GET_STARTED_PATH}
              lockTooltip={lockTooltip}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubNavPanel({
  item,
  variant,
  onRequestClose,
}: SubNavPanelProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const unpin = useUIStore((s) => s.unpin);
  const pinnedPaths = useUIStore((s) => s.pinnedPaths);
  const canUnpin = (path: string) => canUnpinPath(pinnedPaths, path);
  const navLocked = useIsGetStartedLocked();
  const lockTooltip = useGetStartedNavLockTooltip();
  const panelLocked = navLocked && item.path !== "/home";
  const leafDisabled = (path: string) =>
    panelLocked || (navLocked && path !== GET_STARTED_PATH);
  const [openPath, setOpenPath] = useState<string | null>(() =>
    item.sections ? activeAccordionPath(pathname, item.sections) : null
  );

  useEffect(() => {
    if (!item.sections) return;
    const next = activeAccordionPath(pathname, item.sections);
    setOpenPath((prev) => (prev === next ? prev : next));
  }, [pathname, item.path, item.sections]);

  if (!item.sections) return null;

  // Gear flyout: rail already says “Settings” — skip the duplicate panel title.
  const showTitle =
    !(variant === "flyout" && item.path === "/settings" && item.flyoutOnly);
  const showUnpin =
    item.pinnable && pinnedPaths.includes(item.path) && canUnpin(item.path);

  return (
    <nav
      className={cn(
        "w-[248px] shrink-0 overflow-y-auto py-2.5",
        variant === "docked" &&
          "h-full bg-panel text-panel-foreground border-r border-panel-border",
        variant === "flyout" &&
          "max-h-[calc(100vh-2rem)] rounded-lg border border-border bg-popover text-popover-foreground shadow-lg"
      )}
    >
      {(showTitle || showUnpin) && (
        <div className="flex items-center justify-between gap-2 px-5 pb-1.5">
          {showTitle ? (
            <div className="truncate text-sm font-normal text-muted-foreground">
              {toSentenceCase(item.label)}
            </div>
          ) : (
            <span />
          )}
          {showUnpin && (
            <Tooltip.Provider delayDuration={300}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    aria-label="Hide from sidebar"
                    onClick={() => {
                      unpin(item.path);
                      onRequestClose?.();
                    }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="z-50 rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md"
                  >
                    Hide from sidebar
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}
        </div>
      )}
      <Tooltip.Provider delayDuration={300}>
        <div className="flex flex-col px-3">
          {item.sections.map((section, i) => (
            <div key={section.heading ?? i} className="flex flex-col gap-0.5">
              {i > 0 && (
                <div className="my-1 h-px bg-panel-border" aria-hidden="true" />
              )}
              {section.heading ? (
                <div className="px-2.5 pb-0.5 pt-0.5 text-sm font-normal text-muted-foreground">
                  {toSentenceCase(section.heading)}
                </div>
              ) : null}
              {section.items.map((leaf) =>
                leaf.items?.length ? (
                  <AccordionLeaf
                    key={leaf.path}
                    leaf={leaf}
                    open={openPath === leaf.path}
                    onToggle={() =>
                      setOpenPath((prev) =>
                        prev === leaf.path ? null : leaf.path
                      )
                    }
                    onNavigate={() => navigate(leafLandPath(leaf))}
                    onRequestClose={onRequestClose}
                    navLocked={navLocked}
                    lockTooltip={lockTooltip}
                  />
                ) : (
                  <LeafRow
                    key={leaf.path}
                    leaf={leaf}
                    onRequestClose={onRequestClose}
                    disabled={leafDisabled(leaf.path)}
                    lockTooltip={lockTooltip}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </Tooltip.Provider>
    </nav>
  );
}
