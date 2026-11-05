// @summary Dummy Need Help contacts — MRR ≥ 500 gets full team; below gets one contact + Support.

export type HelpMrrTier = "enterprise" | "standard";

export type HelpContactRole =
  | "csm"
  | "key-account"
  | "csm-manager"
  | "account-contact";

export type HelpContact = {
  id: string;
  name: string;
  initials: string;
  role: HelpContactRole;
  roleLabel: string;
  email: string;
  phone?: string;
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

export const HELP_SUPPORT: Record<HelpMrrTier, HelpSupportProfile> = {
  enterprise: {
    tier: "enterprise",
    teamHeading: "Your Wingify team",
    support: {
      phone: "+1-415-909-4660",
      email: "support@wingify.com",
    },
    contacts: [
      {
        id: "csm",
        name: "Priya Sharma",
        initials: "PS",
        role: "csm",
        roleLabel: "Customer Success Manager",
        email: "priya.sharma@wingify.com",
        phone: "+1-415-555-0142",
        scope: "Setup, experiments, and everyday product questions",
        emphasis: "primary",
      },
      {
        id: "kam",
        name: "Marcus Chen",
        initials: "MC",
        role: "key-account",
        roleLabel: "Key Account Manager",
        email: "marcus.chen@wingify.com",
        phone: "+1-415-555-0198",
        scope: "Billing, contracts, and account paperwork",
        emphasis: "default",
      },
      {
        id: "csm-manager",
        name: "Elena Rossi",
        initials: "ER",
        role: "csm-manager",
        roleLabel: "CSM Manager",
        email: "elena.rossi@wingify.com",
        scope: "Unresolved issues that need a manager",
        escalationHint: "Reach out to your CSM first, then escalate here",
        emphasis: "muted",
      },
    ],
  },
  standard: {
    tier: "standard",
    teamHeading: "Your contact",
    support: {
      phone: "+1-415-909-4660",
      email: "support@wingify.com",
    },
    contacts: [
      {
        id: "account-contact",
        name: "Priya Sharma",
        initials: "PS",
        role: "account-contact",
        roleLabel: "Customer Success Manager",
        email: "priya.sharma@wingify.com",
        phone: "+1-415-555-0142",
        scope: "Product help, account questions, and billing",
        emphasis: "primary",
      },
    ],
  },
};
