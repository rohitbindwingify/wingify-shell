/*
 * PageTabs — tab strip above the page for nav rows that own several pages (NavLeaf `tabs`
 * in config/navigation.ts, e.g. Analytics → Recordings: Web · Mobile). Each tab navigates to
 * that page's existing URL. Mounted once in AppLayout; renders nothing elsewhere.
 * Reuses the shadcn Tabs (underline variant) and findTabbedLeaf from lib/nav.
 */
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findTabbedLeaf } from "../../lib/nav";

export default function PageTabs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const leaf = findTabbedLeaf(pathname);
  if (!leaf?.tabs?.length) return null;
  const tabs = [leaf, ...leaf.tabs];

  return (
    <div className="shrink-0 px-12 pt-6">
      <Tabs value={pathname} onValueChange={(path) => navigate(path)}>
        <TabsList variant="underline" className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.path} value={tab.path}>
              {tab.tabLabel ?? tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
