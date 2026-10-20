import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { GET_STARTED_PROGRESS } from "@/data/getStarted";
import { resolveBreadcrumb } from "../../lib/nav";
import { useIsGetStartedLocked } from "@/store/getStartedOnboarding";
import { LeafCrumb, ProductCrumb } from "./CrumbSwitchers";
import PageGuideCluster from "./PageGuideCluster";

export default function BreadcrumbNav() {
  const { pathname } = useLocation();
  const { item, leaf, siblings } = resolveBreadcrumb(pathname);
  const navLocked = useIsGetStartedLocked();

  if (!item) return null;

  // Direct item: product switcher (or plain label for non-products).
  if (!item.sections || !leaf) {
    return (
      <div className="flex min-w-0 items-center gap-1 text-sm">
        <ProductCrumb item={item} locked={navLocked} tone="strong" />
        <PageGuideCluster guide={item.pageGuide} />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-1 text-sm">
      <ProductCrumb item={item} locked={navLocked} tone="normal" />
      <span className="text-muted-foreground" aria-hidden>
        /
      </span>
      <LeafCrumb
        leaf={leaf}
        siblings={siblings}
        locked={navLocked}
        tone="strong"
      />
      <PageGuideCluster guide={leaf.pageGuide} />
      {leaf.path === "/home/get-started" && (
        <Badge tone="ocean" fill="light" size="sm">
          {GET_STARTED_PROGRESS}% Completed
        </Badge>
      )}
    </div>
  );
}
