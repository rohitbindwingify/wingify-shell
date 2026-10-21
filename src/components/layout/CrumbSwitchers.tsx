/** Shared breadcrumb node menus — product switcher and sub-nav leaf switcher. */

import { NavLink } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "@/components/icons/protoLucide";
import {
  productSwitcherItems,
  type NavItem,
  type NavLeaf,
} from "../../config/navigation";
import { firstChildPath } from "../../lib/nav";
import { cn } from "../../lib/utils";

const PRODUCTS = productSwitcherItems();

function isSwitcherProduct(item: NavItem): boolean {
  return PRODUCTS.some((p) => p.path === item.path);
}

/** Shared trigger chrome for every breadcrumb node (list, detail, overflow). */
export const crumbTriggerClass =
  "flex max-w-[10rem] items-center gap-0.5 truncate rounded-md px-1 py-0.5 outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none";

export type CrumbTone = "strong" | "normal" | "muted";

export function crumbToneClass(tone: CrumbTone): string {
  if (tone === "strong") return "font-semibold text-foreground";
  if (tone === "muted") return "font-normal text-muted-foreground";
  return "font-normal text-foreground";
}

/** Product crumb — dropdown to jump between products. */
export function ProductCrumb({
  item,
  locked = false,
  tone = "normal",
  onOpenChange,
}: {
  item: NavItem;
  locked?: boolean;
  tone?: CrumbTone;
  /** Notify parents (e.g. overflow popover) when the menu opens/closes. */
  onOpenChange?: (open: boolean) => void;
}) {
  const showSwitcher = isSwitcherProduct(item) && !locked;
  const weight = crumbToneClass(tone);

  if (!showSwitcher) {
    return (
      <span className={cn("truncate px-1 py-0.5", weight)} title={item.label}>
        {item.label}
      </span>
    );
  }

  return (
    <DropdownMenu.Root modal={false} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Switch product"
          title={item.label}
          className={cn(crumbTriggerClass, weight)}
        >
          <span className="truncate">{item.label}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-50 min-w-[240px] rounded-md border border-border bg-popover p-1.5 text-sm text-popover-foreground shadow-lg"
        >
          {PRODUCTS.map((product) => {
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

/** Sub-nav leaf crumb — dropdown to jump between sibling leaves. */
export function LeafCrumb({
  leaf,
  siblings,
  locked = false,
  tone = "strong",
  onOpenChange,
}: {
  leaf: NavLeaf;
  siblings: NavLeaf[];
  locked?: boolean;
  tone?: CrumbTone;
  onOpenChange?: (open: boolean) => void;
}) {
  const weight = crumbToneClass(tone);

  if (locked || siblings.length <= 1) {
    return (
      <span className={cn("truncate px-1 py-0.5", weight)} title={leaf.label}>
        {leaf.label}
      </span>
    );
  }

  return (
    <DropdownMenu.Root modal={false} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Switch section"
          title={leaf.label}
          className={cn(crumbTriggerClass, weight)}
        >
          <span className="truncate">{leaf.label}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-50 min-w-[220px] rounded-md border border-border bg-popover p-1.5 text-sm text-popover-foreground shadow-lg"
        >
          {siblings.map((sibling) => (
            <DropdownMenu.Item key={sibling.path} asChild>
              <NavLink
                to={sibling.path}
                className={cn(
                  "block cursor-pointer rounded-sm px-3 py-2 outline-none data-[highlighted]:bg-accent",
                  sibling.path === leaf.path && "bg-accent font-medium"
                )}
              >
                {sibling.label}
              </NavLink>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
