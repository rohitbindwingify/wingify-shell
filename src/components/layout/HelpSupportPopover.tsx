// @summary Help / support popover — split: self-serve + Support | MRR-tiered contacts.
// Opens from main-nav Need Help? and detail utility-rail Help (same pattern as Activity).
import {
  cloneElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import {
  BookOpen,
  ChevronRight,
  LifeBuoy,
  Mail,
  Phone,
} from "@/components/icons/protoLucide";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HELP_SUPPORT,
  type HelpContact,
  type HelpMrrTier,
  type HelpSupportProfile,
} from "@/data/helpSupport";
import { cn } from "@/lib/utils";

function HelpActionRow({
  icon: Icon,
  label,
  hint,
}: {
  icon: typeof BookOpen;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60"
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-foreground transition-colors group-hover:bg-background"
        aria-hidden
      >
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">
          {label}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {hint}
        </span>
      </span>
      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
        strokeWidth={1.75}
        aria-hidden
      />
    </button>
  );
}

function ContactCard({ contact }: { contact: HelpContact }) {
  const muted = contact.emphasis === "muted";
  const primary = contact.emphasis === "primary";

  return (
    <li
      className={cn(
        "rounded-xl px-3.5 py-3",
        primary &&
          "bg-background shadow-[0_1px_2px_rgb(from_var(--foreground)_r_g_b_/_0.04)] ring-1 ring-border",
        contact.emphasis === "default" &&
          "bg-background/70 ring-1 ring-border/70",
        muted && "bg-transparent ring-1 ring-dashed ring-border/80"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback
            className={cn(
              "text-[11px] font-medium tracking-wide",
              primary && "bg-foreground text-background",
              contact.emphasis === "default" &&
                "bg-muted text-foreground ring-1 ring-border",
              muted && "bg-muted/50 text-muted-foreground"
            )}
          >
            {contact.initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-1.5">
                <p
                  className={cn(
                    "truncate text-sm font-semibold tracking-tight",
                    muted ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {contact.name}
                </p>
                {primary || muted ? (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                    {primary ? "Start here" : "Escalation"}
                  </span>
                ) : null}
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {contact.roleLabel}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              {contact.phone ? (
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  aria-label={`Call ${contact.name}`}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Phone className="size-3.5" strokeWidth={1.75} />
                </a>
              ) : null}
              <a
                href={`mailto:${contact.email}`}
                aria-label={`Email ${contact.name}`}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-colors",
                  primary
                    ? "bg-foreground text-background hover:opacity-90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Mail className="size-3.5" strokeWidth={1.75} />
              </a>
            </div>
          </div>

          <p
            className={cn(
              "mt-1.5 text-xs leading-snug",
              muted ? "text-muted-foreground/80" : "text-muted-foreground"
            )}
          >
            {contact.scope}
          </p>

          {contact.escalationHint ? (
            <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground/70">
              {contact.escalationHint}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function SupportBlock({
  profile,
  emphasize,
}: {
  profile: HelpSupportProfile;
  emphasize: boolean;
}) {
  const { phone, email } = profile.support;
  return (
    <div className={cn("px-4 py-3.5", emphasize && "bg-muted/40")}>
      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground/70">
        Wingify Support
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {emphasize
          ? "Always available for product and account questions"
          : "General support if your team is unavailable"}
      </p>
      <div className="mt-2.5 flex flex-col gap-1.5">
        <a
          href={`tel:${phone.replace(/\s+/g, "")}`}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted/60"
        >
          <Phone className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
          {phone}
        </a>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted/60"
        >
          <Mail className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
          {email}
        </a>
      </div>
    </div>
  );
}

function HelpPopoverContent() {
  // Prototype toggle so both MRR tiers can be reviewed without a backend.
  const [tier, setTier] = useState<HelpMrrTier>("enterprise");
  const profile = HELP_SUPPORT[tier];
  const stepped = profile.tier === "enterprise" && profile.contacts.length > 1;

  return (
    <div className="flex max-h-[min(32rem,calc(100vh-4rem))] w-[min(44rem,calc(100vw-2rem))] overflow-hidden">
      {/* Left — self-serve + Support */}
      <section className="flex min-w-0 flex-[1.05] flex-col bg-background">
        <header className="shrink-0 border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Get help</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Guides, tickets, and Support
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="divide-y divide-border">
            <HelpActionRow
              icon={BookOpen}
              label="Knowledge Base"
              hint="Guides, FAQs, and how-tos"
            />
            <HelpActionRow
              icon={LifeBuoy}
              label="Raise a Support Ticket"
              hint="Trackable help from our team"
            />
          </div>
          <div className="border-t border-border">
            <SupportBlock
              profile={profile}
              emphasize={tier === "standard"}
            />
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-4 py-2.5">
          <span className="text-[10px] tracking-wide text-muted-foreground/50">
            Preview MRR
          </span>
          <div className="flex gap-0.5 rounded-full bg-muted/60 p-0.5">
            {(
              [
                { id: "enterprise", label: "≥ $500" },
                { id: "standard", label: "< $500" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTier(option.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] transition-colors",
                  tier === option.id
                    ? "bg-background font-medium text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </footer>
      </section>

      {/* Right — named contacts */}
      <section className="flex min-w-0 flex-1 flex-col border-l border-border bg-muted/40">
        <header className="shrink-0 border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            {profile.teamHeading}
          </h2>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
            {stepped
              ? "Start with your CSM. Escalate only if needed."
              : "One person for product and account questions."}
          </p>
        </header>

        <ol className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3.5 py-3.5">
          {profile.contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </ol>
      </section>
    </div>
  );
}

const HOVER_CLOSE_MS = 120;

export default function HelpSupportPopover({
  children,
  side = "right",
  align = "end",
  openMode = "hover",
}: {
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** hover = open on mouse enter; click = open only from the trigger. */
  openMode?: "hover" | "click";
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const clickMode = openMode === "click";

  useEffect(() => {
    return () => window.clearTimeout(closeTimer.current);
  }, []);

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    if (clickMode) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), HOVER_CLOSE_MS);
  };

  const trigger = cloneElement(children, {
    "aria-expanded": open,
    "aria-haspopup": "dialog",
    className: cn(
      (children.props as { className?: string }).className,
      open && "bg-muted hover:bg-muted"
    ),
  } as Partial<typeof children.props> & {
    "aria-expanded": boolean;
    "aria-haspopup": string;
    className: string;
  });

  return (
    <div
      onMouseEnter={
        clickMode
          ? undefined
          : () => {
              cancelClose();
              setOpen(true);
            }
      }
      onMouseLeave={clickMode ? undefined : scheduleClose}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          sideOffset={10}
          collisionPadding={12}
          onMouseEnter={clickMode ? undefined : cancelClose}
          onMouseLeave={clickMode ? undefined : scheduleClose}
          className="z-50 w-auto max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-border bg-popover p-0 text-popover-foreground shadow-lg"
        >
          <HelpPopoverContent />
        </PopoverContent>
      </Popover>
    </div>
  );
}
