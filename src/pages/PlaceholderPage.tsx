// Crumb is enough — no PageHeader title (matches product list pages).
import { useLocation } from "react-router-dom";
import { iconForPath, pageLabel } from "../lib/nav";
import ComingSoonState from "../components/empty/ComingSoonState";

function isAccountsPath(pathname: string): boolean {
  return (
    pathname === "/settings/accounts" ||
    pathname.startsWith("/settings/accounts/")
  );
}

export default function PlaceholderPage() {
  const { pathname } = useLocation();
  const accountsStub = isAccountsPath(pathname);
  const title = accountsStub ? "Coming soon" : pageLabel(pathname);
  const icon = accountsStub ? undefined : iconForPath(pathname);

  return (
    <div className="flex min-h-full flex-col">
      <ComingSoonState title={title} icon={icon} />
    </div>
  );
}
