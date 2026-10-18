/** Get Started footer — quiet utility line, grouped, wordmark at the end. */

import wordmarkUrl from "@/assets/wingify-wordmark.png";
import {
  Activity,
  BookOpen,
  GitFork,
  Globe,
  Headphones,
  Phone,
  Users,
  type LucideIcon,
} from "@/components/icons/protoLucide";

const GROUPS: { icon: LucideIcon; label: string }[][] = [
  [
    { icon: Headphones, label: "Get Support" },
    { icon: BookOpen, label: "Developer resources" },
    { icon: Phone, label: "+1-415-909-4660" },
  ],
  [
    { icon: Users, label: "Show logged in users" },
    { icon: Globe, label: "Data Region: US" },
  ],
  [
    { icon: Activity, label: "Uptime Status" },
    { icon: GitFork, label: "Branch Information" },
  ],
];

function FooterItem({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      <Icon className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
      {label}
    </button>
  );
}

export default function GetStartedPageFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/40">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-8 py-2.5 lg:px-12">
        <nav
          aria-label="Support and workspace"
          className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2"
        >
          {GROUPS.map((group, index) => (
            <div key={group[0].label} className="flex items-center gap-x-4">
              {index > 0 ? (
                <span aria-hidden className="text-xs text-border">
                  ·
                </span>
              ) : null}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {group.map((item) => (
                  <FooterItem key={item.label} icon={item.icon} label={item.label} />
                ))}
              </div>
            </div>
          ))}
        </nav>
        <img
          src={wordmarkUrl}
          alt="Wingify"
          className="h-4 w-auto shrink-0 opacity-80"
          draggable={false}
        />
      </div>
    </footer>
  );
}
