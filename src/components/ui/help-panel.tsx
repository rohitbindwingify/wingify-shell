/** Help panel — reader order, with a designed surface for each step. */

import { useEffect, useState, type ComponentType, type ReactElement, type SVGProps } from "react";
import {
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  LifeBuoy,
  Mail,
  Phone,
} from "@/components/icons/protoLucide";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  HelpContact,
  HelpMrrTier,
  HelpSupportProfile,
} from "@/data/helpSupport";
import { cn } from "@/lib/utils";

type IconType = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

function SectionLabel({ children }: { children: string }) {
  return (
    <h3 className="-mb-1 text-xs font-medium text-muted-foreground">
      {children}
    </h3>
  );
}

function HelpActionRow({
  icon: Icon,
  label,
  hint,
}: {
  icon: IconType;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-muted/50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
        <Icon className="size-4" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">
          {label}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
          {hint}
        </span>
      </span>
      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        strokeWidth={1.75}
        aria-hidden
      />
    </button>
  );
}

function CopyIconButton({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <Button
      type="button"
      variant="shadow"
      size="icon"
      className={cn(
        "h-7 w-7 shrink-0 text-muted-foreground",
        className
      )}
      aria-label={copied ? "Copied" : label}
      onClick={() => {
        void navigator.clipboard.writeText(value).then(
          () => setCopied(true),
          () => undefined
        );
      }}
    >
      {copied ? (
        <Check strokeWidth={2.25} aria-hidden />
      ) : (
        <Copy strokeWidth={1.75} aria-hidden />
      )}
    </Button>
  );
}

function contactFactsClass(hasPhone: boolean) {
  return cn(
    "grid border-t border-border",
    hasPhone
      ? "grid-cols-[auto_minmax(0,1fr)] divide-x divide-border"
      : "grid-cols-1"
  );
}

function ContactFact({
  href,
  label,
  value,
  copyLabel,
  fit = false,
  tooltip = false,
}: {
  href: string;
  label: string;
  value: string;
  copyLabel: string;
  /** Hug the value so a neighboring column can take the leftover width. */
  fit?: boolean;
  /** Show the full value when the line is truncated. */
  tooltip?: boolean;
}) {
  const link = (
    <a
      href={href}
      className="mt-px block truncate text-xs leading-none text-foreground underline-offset-4 hover:underline"
    >
      {value}
    </a>
  );

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-1 px-3 py-2.5 transition-colors hover:bg-muted",
        fit && "w-max max-w-full"
      )}
    >
      <span className={cn("min-w-0", fit ? "shrink-0" : "flex-1")}>
        <span className="block text-[11px] leading-none text-muted-foreground">{label}</span>
        {tooltip ? (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent className="z-[60]">{value}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          link
        )}
      </span>
      <CopyIconButton value={value} label={copyLabel} />
    </div>
  );
}

function ScopeTip({
  scope,
  children,
}: {
  scope: string;
  children: ReactElement;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="top" className="z-[60] max-w-60 text-left leading-snug">
          {scope}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SetupMeetingButton({ className }: { className?: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn("size-7 shrink-0", className)}
            aria-label="Setup a meeting"
            onClick={(event) => event.stopPropagation()}
          >
            <Calendar className="size-3.5" strokeWidth={1.75} aria-hidden />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="z-[60]">Setup a meeting</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ManagerDisclosure({ contact }: { contact: HelpContact }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-background">
      <ScopeTip scope={contact.scope}>
        <button
          type="button"
          className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-muted/50"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <Avatar className="size-10">
            <AvatarImage
              src={contact.photo}
              alt=""
              className="object-cover object-[center_20%]"
            />
            <AvatarFallback className="bg-muted text-[11px] font-medium text-muted-foreground">
              {contact.initials}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-medium tracking-tight text-foreground">
              {contact.name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {contact.roleLabel}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
            {open ? "Hide" : "Escalate"}
            <ChevronRight
              className={cn("size-3.5 transition-transform", open && "rotate-90")}
              strokeWidth={1.75}
              aria-hidden
            />
          </span>
        </button>
      </ScopeTip>
      {open ? (
        <>
          <div className={contactFactsClass(Boolean(contact.phone))}>
            {contact.phone ? (
              <ContactFact
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                label="Phone"
                value={contact.phone}
                copyLabel="Copy phone number"
                fit
              />
            ) : null}
            <ContactFact
              href={`mailto:${contact.email}`}
              label="Email"
              value={contact.email}
              copyLabel="Copy email address"
              tooltip
            />
          </div>
          {contact.escalationHint ? (
            <p className="border-t border-border px-3.5 py-2.5 text-xs leading-snug text-muted-foreground">
              {contact.escalationHint}
            </p>
          ) : null}
        </>
      ) : null}
    </article>
  );
}

function ContactBody({
  contact,
  quiet = false,
}: {
  contact: HelpContact;
  quiet?: boolean;
}) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border bg-background",
        "border-border"
      )}
    >
      <div className="flex items-center gap-2 px-3.5 py-3">
        <ScopeTip scope={contact.scope}>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage
                src={contact.photo}
                alt=""
                className="object-cover object-[center_20%]"
              />
              <AvatarFallback className="bg-muted text-[11px] font-medium text-muted-foreground">
                {contact.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-[15px] font-medium tracking-tight text-foreground">
                  {contact.name}
                </p>
                {quiet ? (
                  <span className="shrink-0 pt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Escalate
                  </span>
                ) : null}
              </div>
              <p className="truncate text-xs text-muted-foreground">{contact.roleLabel}</p>
              {contact.escalationHint ? (
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  {contact.escalationHint}
                </p>
              ) : null}
            </div>
          </div>
        </ScopeTip>
        {contact.role === "csm" ? <SetupMeetingButton /> : null}
      </div>
      <div className={contactFactsClass(Boolean(contact.phone))}>
        {contact.phone ? (
          <ContactFact
            href={`tel:${contact.phone.replace(/\s+/g, "")}`}
            label="Phone"
            value={contact.phone}
            copyLabel="Copy phone number"
            fit
          />
        ) : null}
        <ContactFact
          href={`mailto:${contact.email}`}
          label="Email"
          value={contact.email}
          copyLabel="Copy email address"
          tooltip
        />
      </div>
    </article>
  );
}

const PREVIEW_TIERS: { tier: HelpMrrTier; label: string }[] = [
  { tier: "enterprise", label: ">500 MRR" },
  { tier: "standard", label: "<500 MRR" },
];

export function HelpPanel({
  profile,
  onPreviewTier,
}: {
  profile: HelpSupportProfile;
  onPreviewTier?: (tier: HelpMrrTier) => void;
}) {
  const stepped = profile.tier === "enterprise" && profile.contacts.length > 1;
  const { phone, email } = profile.support;

  const leads = profile.contacts.filter((contact) => contact.emphasis !== "muted");
  const managers = profile.contacts.filter((contact) => contact.emphasis === "muted");

  const team = (
    <section className="flex flex-col gap-3">
      <SectionLabel>{profile.teamHeading}</SectionLabel>
      <ol className="flex flex-col gap-2">
        {leads.map((contact) => (
          <li key={contact.id}>
            <ContactBody contact={contact} />
          </li>
        ))}
        {managers.map((contact) => (
          <li key={contact.id}>
            <ManagerDisclosure contact={contact} />
          </li>
        ))}
      </ol>
    </section>
  );

  const selfServe = (
    <section className="flex flex-col gap-3">
      <SectionLabel>Self-serve</SectionLabel>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
        <HelpActionRow
          icon={BookOpen}
          label="Knowledge Base"
          hint="Search guides and FAQs"
        />
        <HelpActionRow
          icon={LifeBuoy}
          label="Submit a ticket"
          hint="We will follow it with you"
        />
      </div>
    </section>
  );

  const support = (
    <section className="flex flex-col gap-3">
      <SectionLabel>Support</SectionLabel>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
        <div className="flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-muted/50">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Phone className="size-4" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="flex min-w-0 items-center gap-1">
            <span className="min-w-0">
              <span className="block text-xs leading-none text-muted-foreground">Phone</span>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="mt-px block text-sm font-medium leading-none text-foreground"
              >
                {phone}
              </a>
            </span>
            <CopyIconButton value={phone} label="Copy phone number" />
          </span>
        </div>
        <div className="flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-muted/50">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Mail className="size-4" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="flex min-w-0 items-center gap-1">
            <span className="min-w-0">
              <span className="block text-xs leading-none text-muted-foreground">Email</span>
              <a
                href={`mailto:${email}`}
                className="mt-px block text-sm font-medium leading-none text-foreground"
              >
                {email}
              </a>
            </span>
            <CopyIconButton value={email} label="Copy email address" />
          </span>
        </div>
      </div>
    </section>
  );

  return (
    <div
      className={cn(
        "flex max-h-[min(40rem,calc(100vh-4rem))] flex-col bg-popover text-popover-foreground",
        stepped
          ? "w-[min(52rem,calc(100vw-2rem))]"
          : "w-[min(26rem,calc(100vw-2rem))]"
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Get help
        </h2>
        {onPreviewTier ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-xs font-normal text-muted-foreground"
              >
                usecase
                <span className="text-foreground">
                  {PREVIEW_TIERS.find((item) => item.tier === profile.tier)?.label}
                </span>
                <ChevronDown className="size-3.5" strokeWidth={1.75} aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[60] min-w-36">
              <DropdownMenuRadioGroup
                value={profile.tier}
                onValueChange={(value) => onPreviewTier(value as HelpMrrTier)}
              >
                {PREVIEW_TIERS.map(({ tier, label }) => (
                  <DropdownMenuRadioItem key={tier} value={tier}>
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </header>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto",
          stepped && "grid grid-cols-2 items-stretch"
        )}
      >
        <div className="px-4 py-4">
          {team}
        </div>
        <div
          className={cn(
            "flex flex-col gap-5 bg-muted px-4 py-4",
            stepped && "min-h-full"
          )}
        >
          {selfServe}
          <div className={cn(stepped && "mt-auto")}>{support}</div>
        </div>
      </div>
    </div>
  );
}
