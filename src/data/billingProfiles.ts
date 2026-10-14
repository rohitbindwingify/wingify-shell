/** Saved cards a workspace can use to pay invoices. Dummy, client-side only. */

export type BillingProfile = {
  id: string;
  name: string;
  holder: string;
  brand: string;
  last4: string;
  expiry: string;
};

export type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Paid" | "Overdue";
  profileId: string;
};

export const BILLING_PROFILES: BillingProfile[] = [
  {
    id: "finance",
    name: "Wingify Finance",
    holder: "Wingify Finance",
    brand: "Visa",
    last4: "4242",
    expiry: "08/28",
  },
  {
    id: "us",
    name: "Wingify US",
    holder: "Wingify Inc.",
    brand: "Mastercard",
    last4: "5512",
    expiry: "03/27",
  },
  {
    id: "marketing",
    name: "Marketing",
    holder: "Wingify Marketing",
    brand: "American Express",
    last4: "1008",
    expiry: "11/26",
  },
];

export const INVOICES: Invoice[] = [
  {
    id: "INV-2026-1104",
    date: "Sep 24, 2026",
    description: "User Feedback — Annual",
    amount: "$6,000.00",
    status: "Overdue",
    profileId: "marketing",
  },
  {
    id: "INV-2026-1042",
    date: "Aug 24, 2026",
    description: "Web Experimentation & Rollout — Annual",
    amount: "$48,000.00",
    status: "Paid",
    profileId: "finance",
  },
  {
    id: "INV-2026-0988",
    date: "Jun 15, 2026",
    description: "Feature Management — Annual",
    amount: "$24,000.00",
    status: "Paid",
    profileId: "finance",
  },
  {
    id: "INV-2025-0811",
    date: "Sep 2, 2025",
    description: "Behavior Analytics — Annual",
    amount: "$12,000.00",
    status: "Paid",
    profileId: "us",
  },
  {
    id: "INV-2025-0640",
    date: "May 26, 2025",
    description: "Web Personalization — Annual",
    amount: "$18,000.00",
    status: "Paid",
    profileId: "us",
  },
  {
    id: "INV-2024-0512",
    date: "Sep 2, 2024",
    description: "Wingz — Annual",
    amount: "$9,600.00",
    status: "Paid",
    profileId: "marketing",
  },
];

export function billingProfileById(id: string) {
  return BILLING_PROFILES.find((profile) => profile.id === id);
}

export function invoicesForProfile(profileId: string) {
  return INVOICES.filter((invoice) => invoice.profileId === profileId);
}
