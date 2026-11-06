/*
 * SuiteProductSwitcher — product picker at the top of a suite's sub-nav (Analytics: Journey
 * analytics · Behaviour analytics · User feedback). Shows the current product; clicking it lists
 * the suite's products in place of the pages, and picking one goes to that product's first page.
 * Used by ExpandedNav (open nav) and SubNavPanel (hover flyout). Products come from NavSection
 * `product` in config/navigation.ts; reuses the shadcn Button and existing nav row styling.
 * Opens inline (not a popover) so the hover flyout never loses the pointer.
 */
import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, ChevronsUpDown } from "@/components/icons/protoLucide";
import { Button } from "@/components/ui/button";
import { leafLandPath, type NavSection } from "../../config/navigation";
import { cn } from "../../lib/utils";

function ProductIcon({ product }: { product: NavSection }) {
  const Icon = product.product!.icon;
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
      <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
    </span>
  );
}

export default function SuiteProductSwitcher({
  products,
  activeIndex,
  tabIndex,
  children,
}: {
  products: NavSection[];
  activeIndex: number;
  tabIndex?: number;
  /** The active product's pages, shown while the product list is closed. */
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const active = products[activeIndex];

  useEffect(() => setOpen(false), [pathname]);

  const choose = (index: number) => {
    setOpen(false);
    const first = products[index].items[0];
    if (index !== activeIndex && first) navigate(leafLandPath(first));
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        tabIndex={tabIndex}
        aria-expanded={open}
        aria-label={`Product: ${active.heading}. Switch product`}
        onClick={() => setOpen((v) => !v)}
        className="h-auto w-full justify-start gap-2 px-1.5 py-1.5 font-medium"
      >
        <ProductIcon product={active} />
        <span className="min-w-0 flex-1 truncate text-left">{active.heading}</span>
        <ChevronsUpDown className="text-muted-foreground" aria-hidden />
      </Button>

      {open ? (
        <div className="flex flex-col gap-0.5 pt-1">
          {products.map((product, index) => (
            <Button
              key={product.heading}
              type="button"
              variant="ghost"
              aria-current={index === activeIndex ? "true" : undefined}
              tabIndex={tabIndex}
              onClick={() => choose(index)}
              className={cn(
                "h-auto w-full justify-start gap-2 px-1.5 py-1.5 font-normal",
                index === activeIndex && "bg-accent text-accent-foreground hover:bg-accent"
              )}
            >
              <ProductIcon product={product} />
              <span className="flex min-w-0 flex-1 flex-col text-left">
                <span className="truncate text-sm font-medium">{product.heading}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {product.product!.description}
                </span>
              </span>
              {index === activeIndex && <Check aria-hidden />}
            </Button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-0.5 pt-1">{children}</div>
      )}
    </div>
  );
}
