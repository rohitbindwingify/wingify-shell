/** Get Started footer — docked crumb row (option E), generous gaps + bold dots. */

import { Fragment } from "react";
import wordmarkUrl from "@/assets/wingify-wordmark.png";
import {
  Activity,
  BookOpen,
  Globe,
  Users,
  type LucideIcon,
} from "@/components/icons/protoLucide";
import { crumbTriggerClass } from "@/components/layout/CrumbSwitchers";
import { cn } from "@/lib/utils";

type FooterLink = { icon: LucideIcon; label: string };

const LINKS: FooterLink[] = [
  { icon: BookOpen, label: "Developer resources" },
  { icon: Users, label: "Show logged in users" },
  { icon: Globe, label: "Data Region: US" },
  { icon: Activity, label: "Uptime Status" },
];

function CrumbLink({ icon: Icon, label }: FooterLink) {
  return (
    <button
      type="button"
      title={label}
      className={cn(
        crumbTriggerClass,
        "max-w-[14rem] gap-1.5 text-foreground/80 hover:text-foreground",
      )}
    >
      <Icon
        className="size-3.5 shrink-0 text-foreground/80"
        strokeWidth={1.75}
        aria-hidden
      />
      <span className="truncate">{label}</span>
    </button>
  );
}

export default function GetStartedPageFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-panel/95 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-3.5 lg:px-12">
        <nav
          aria-label="Workspace utilities"
          className="flex min-w-0 flex-wrap items-center gap-y-2 text-sm"
        >
          {LINKS.map((link, i) => (
            <Fragment key={link.label}>
              {i > 0 ? (
                <span
                  aria-hidden
                  className="mx-5 inline-flex size-1 shrink-0 rounded-full bg-foreground/80"
                />
              ) : null}
              <CrumbLink {...link} />
            </Fragment>
          ))}
        </nav>
        <img
          src={wordmarkUrl}
          alt="Wingify"
          className="h-6 w-auto shrink-0"
          draggable={false}
        />
      </div>
    </footer>
  );
}
