// @summary Dummy Need Help contacts — MRR ≥ 500 gets full team; below gets one contact + Support.

import elenaRossi from "@/assets/help/elena-rossi.jpg";
import marcusChen from "@/assets/help/marcus-chen.jpg";
import priyaSharma from "@/assets/help/priya-sharma.jpg";

export type HelpMrrTier = "enterprise" | "standard" | "initials";

export type HelpContactRole =
  | "csm"
  | "key-account"
  | "csm-manager"
  | "account-contact";

export type HelpContact = {
  id: string;
  name: string;
  initials: string;
  /** When omitted, the avatar shows initials only. */
  photo?: string;
  role: HelpContactRole;
  roleLabel: string;
  email: string;
  /** Booking link for the Meet CTA (CSM). */
  meetingUrl?: string;
  /** One-line “owns this” copy. */
  scope: string;
  /** Soft escalation guidance (manager only). */
  escalationHint?: string;
  /** Visual weight in the list — primary first. */
  emphasis: "primary" | "default" | "muted";
};

export type HelpSupportProfile = {
  tier: HelpMrrTier;
  /** Human label for the people block. */
  teamHeading: string;
  contacts: HelpContact[];
  support: {
    phone: string;
    email: string;
  };
};

export const MRR_ENTERPRISE_THRESHOLD = 500;

const SUPPORT = {
  phone: "+1-415-909-4660",
  email: "support@wingify.com",
} as const;

const ENTERPRISE_CONTACTS: HelpContact[] = [
  {
    id: "csm",
    name: "Priya Sharma",
    initials: "PS",
    photo: priyaSharma,
    role: "csm",
    roleLabel: "Customer Success Manager",
    email: "priya.sharma@wingify.com",
    meetingUrl: "https://calendly.com/priya-sharma-wingify/30min",
    scope:
      "Hey, I am Priya and I will help you with experiments, optimization, and product questions.",
    emphasis: "primary",
  },
  {
    id: "kam",
    name: "Marcus Chen",
    initials: "MC",
    photo: marcusChen,
    role: "key-account",
    roleLabel: "Key Account Manager",
    email: "marcus.chen@wingify.com",
    scope:
      "Hey, I am Marcus and I will help you with billing, contracts, and account paperwork.",
    emphasis: "default",
  },
  {
    id: "csm-manager",
    name: "Elena Rossi",
    initials: "ER",
    photo: elenaRossi,
    role: "csm-manager",
    roleLabel: "CSM Manager",
    email: "elena.rossi@wingify.com",
    scope:
      "Hey, I am Elena and I will help you when an issue still needs a manager.",
    emphasis: "muted",
  },
];

export const HELP_SUPPORT: Record<HelpMrrTier, HelpSupportProfile> = {
  enterprise: {
    tier: "enterprise",
    teamHeading: "Your Wingify team",
    support: SUPPORT,
    contacts: ENTERPRISE_CONTACTS,
  },
  standard: {
    tier: "standard",
    teamHeading: "Your contact",
    support: SUPPORT,
    contacts: [
      {
        id: "account-contact",
        name: "Priya Sharma",
        initials: "PS",
        photo: priyaSharma,
        role: "account-contact",
        roleLabel: "Customer Success Manager",
        email: "priya.sharma@wingify.com",
        scope:
          "Hey, I am Priya and I will help you with product questions, your account, and billing.",
        emphasis: "primary",
      },
    ],
  },
  initials: {
    tier: "initials",
    teamHeading: "Your Wingify team",
    support: SUPPORT,
    contacts: ENTERPRISE_CONTACTS.map((contact) =>
      contact.id === "kam"
        ? { ...contact, photo: undefined }
        : contact
    ),
  },
};
