/** Detail header lead crumbs — workspace + distinct middle icons + entity last. */

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ComponentType,
  type ReactNode,
} from "react";
import { Link, NavLink } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";
import {
  Layers,
  List,
  MoreHorizontal,
} from "@/components/icons/protoLucide";
import { NavPagesIcon } from "@/components/icons/sidebarNavIcons";
import type { NavItem, NavLeaf } from "@/config/navigation";
import { productSwitcherItems } from "@/config/navigation";
import { firstChildPath } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useIsGetStartedLocked } from "@/store/getStartedOnboarding";
import { ProductCrumb, LeafCrumb } from "./CrumbSwitchers";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

const OPEN_MS = 120;
const CLOSE_MS = 220;

type CrumbIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

export type OverflowCrumb = {
  label: string;
  to: string;
  icon?: CrumbIcon;
};

type Props = {
  product?: NavItem;
  leaf?: NavLeaf;
  siblings?: NavLeaf[];
  earlier?: OverflowCrumb[];
};

/** Prefer leaf/earlier icons; never reuse an icon already shown in the trail. */
const SECTION_FALLBACKS: CrumbIcon[] = [Layers, List, NavPagesIcon];

function pickDistinct(
  preferred: CrumbIcon | undefined,
  used: Set<CrumbIcon>,
  fallbacks: CrumbIcon[]
): CrumbIcon {
  if (preferred && !used.has(preferred)) return preferred;
  for (const candidate of fallbacks) {
    if (!used.has(candidate)) return candidate;
  }
  return preferred ?? fallbacks[0]!;
}

function Slash() {
  return (
    <span className="shrink-0 text-muted-foreground" aria-hidden>
      /
    </span>
  );
}

const IconTrigger = forwardRef<
  HTMLButtonElement,
  {
    label: string;
    children: ReactNode;
  } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type">
>(function IconTrigger({ label, children, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors",
        "hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

function ProductIconCrumb({
  item,
  locked,
  onOpenChange,
}: {
  item: NavItem;
  locked: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const Icon = item.icon;
  const products = productSwitcherItems();
  const showSwitcher = products.some((p) => p.path === item.path) && !locked;

  if (!showSwitcher) {
    return (
      <IconTrigger label={item.label}>
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
      </IconTrigger>
    );
  }

  return (
    <DropdownMenu.Root modal={false} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <IconTrigger label={item.label}>
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        </IconTrigger>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-50 min-w-[240px] rounded-md border border-border bg-popover p-1.5 text-sm text-popover-foreground shadow-lg"
        >
          {products.map((product) => {
            const ProductIcon = product.icon;
            const to = firstChildPath(product);
            const active = product.path === item.path;
            return (
              <DropdownMenu.Item key={product.path} asChild>
                <NavLink
                  to={to}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 outline-none data-[highlighted]:bg-accent",
                    active && "bg-accent font-medium"
                  )}
                >
                  <ProductIcon
                    className="h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="truncate">{product.label}</span>
                </NavLink>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function LeafIconCrumb({
  leaf,
  siblings,
  locked,
  icon: Icon,
  onOpenChange,
}: {
  leaf: NavLeaf;
  siblings: NavLeaf[];
  locked: boolean;
  icon: CrumbIcon;
  onOpenChange?: (open: boolean) => void;
}) {
  if (locked || siblings.length <= 1) {
    return (
      <IconTrigger label={leaf.label}>
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
      </IconTrigger>
    );
  }

  return (
    <DropdownMenu.Root modal={false} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <IconTrigger label={leaf.label}>
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        </IconTrigger>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-50 min-w-[220px] rounded-md border border-border bg-popover p-1.5 text-sm text-popover-foreground shadow-lg"
        >
          {siblings.map((sibling) => {
            const SiblingIcon = sibling.icon;
            return (
              <DropdownMenu.Item key={sibling.path} asChild>
                <NavLink
                  to={sibling.path}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 outline-none data-[highlighted]:bg-accent",
                    sibling.path === leaf.path && "bg-accent font-medium"
                  )}
                >
                  {SiblingIcon ? (
                    <SiblingIcon
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  ) : null}
                  <span className="truncate">{sibling.label}</span>
                </NavLink>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function MiddleOverflow({
  product,
  leaf,
  siblings,
  earlier,
  locked,
}: {
  product?: NavItem;
  leaf?: NavLeaf;
  siblings: NavLeaf[];
  earlier: OverflowCrumb[];
  locked: boolean;
}) {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
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
    scheduleClose();
  };

  const hasMiddle = !!product || !!leaf || earlier.length > 0;
  if (!hasMiddle) return null;

  return (
    <>
      <Slash />
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
            <MoreHorizontal
              className="size-3.5"
              strokeWidth={1.75}
              aria-hidden
            />
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
              {product ? (
                <ProductCrumb
                  item={product}
                  locked={locked}
                  tone="muted"
                  onOpenChange={handleNestedOpenChange}
                />
              ) : null}
              {product && (leaf || earlier.length > 0) ? <Slash /> : null}
              {leaf ? (
                <LeafCrumb
                  leaf={leaf}
                  siblings={siblings}
                  locked={locked}
                  tone="muted"
                  onOpenChange={handleNestedOpenChange}
                />
              ) : null}
              {leaf && earlier.length > 0 ? <Slash /> : null}
              {earlier.map((crumb, i) => (
                <span key={crumb.to} className="contents">
                  {i > 0 ? <Slash /> : null}
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
    </>
  );
}

function MiddleIcons({
  product,
  leaf,
  siblings,
  earlier,
  locked,
}: {
  product?: NavItem;
  leaf?: NavLeaf;
  siblings: NavLeaf[];
  earlier: OverflowCrumb[];
  locked: boolean;
}) {
  const used = new Set<CrumbIcon>();
  if (product?.icon) used.add(product.icon);

  const leafIcon = leaf
    ? pickDistinct(leaf.icon, used, SECTION_FALLBACKS)
    : undefined;
  if (leafIcon) used.add(leafIcon);

  return (
    <>
      {product ? (
        <>
          <Slash />
          <ProductIconCrumb item={product} locked={locked} />
        </>
      ) : null}
      {leaf && leafIcon ? (
        <>
          <Slash />
          <LeafIconCrumb
            leaf={leaf}
            siblings={siblings}
            locked={locked}
            icon={leafIcon}
          />
        </>
      ) : null}
      {earlier.map((crumb) => {
        const Icon = pickDistinct(crumb.icon, used, SECTION_FALLBACKS);
        used.add(Icon);
        return (
          <span key={crumb.to} className="contents">
            <Slash />
            <Link
              to={crumb.to}
              title={crumb.label}
              aria-label={crumb.label}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            </Link>
          </span>
        );
      })}
    </>
  );
}

export default function DetailCrumbOverflow({
  product,
  leaf,
  siblings = [],
  earlier = [],
}: Props) {
  const navLocked = useIsGetStartedLocked();

  const middleProps = {
    product,
    leaf,
    siblings,
    earlier,
    locked: navLocked,
  };

  return (
    <div className="flex min-w-0 items-center gap-1 text-sm">
      <WorkspaceSwitcher compact shortName nameMaxChars={5} tone="muted" />
      {/* Narrow: collapse middle under …. md+: distinct icons for product / section. */}
      <div className="contents md:hidden">
        <MiddleOverflow {...middleProps} />
      </div>
      <div className="hidden md:contents">
        <MiddleIcons {...middleProps} />
      </div>
    </div>
  );
}
