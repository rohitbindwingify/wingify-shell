/** Settings → Subscription & Invoices → Billing Profile.
 * Saved cards used to pay invoices. A workspace can keep more than one.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BILLING_PROFILES,
  invoicesForProfile,
  type BillingProfile,
  type Invoice,
} from "@/data/billingProfiles";

const BRANDS = ["Visa", "Mastercard", "American Express"];

function invoiceSummary(invoices: Invoice[]) {
  if (invoices.length === 0) return "No invoices paid with this card yet.";
  const paid = invoices.filter((invoice) => invoice.status === "Paid").length;
  const overdue = invoices.filter((invoice) => invoice.status === "Overdue").length;
  const parts: string[] = [];
  if (paid) parts.push(`Paid ${paid} ${paid === 1 ? "invoice" : "invoices"}`);
  if (overdue) parts.push(`${overdue} overdue`);
  return parts.join(" · ");
}

const emptyDraft = {
  name: "",
  holder: "",
  brand: "Visa",
  last4: "",
  expiry: "",
};

export default function BillingProfilePage() {
  const [profiles, setProfiles] = useState<BillingProfile[]>(BILLING_PROFILES);
  const [defaultId, setDefaultId] = useState(BILLING_PROFILES[0]?.id ?? "");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  const saveProfile = () => {
    const last4 = draft.last4.replace(/\D/g, "").slice(0, 4);
    if (!draft.name.trim() || last4.length !== 4 || !draft.expiry.trim()) return;
    const profile: BillingProfile = {
      id: `card-${Date.now()}`,
      name: draft.name.trim(),
      holder: draft.holder.trim() || draft.name.trim(),
      brand: draft.brand,
      last4,
      expiry: draft.expiry.trim(),
    };
    setProfiles((current) => [...current, profile]);
    setDefaultId(profile.id);
    setDraft(emptyDraft);
    setAdding(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-8 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Billing profiles</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Saved cards this workspace can use to pay invoices. One profile is the
            default for the next bill.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="shadow-none"
          onClick={() => setAdding((open) => !open)}
        >
          {adding ? "Cancel" : "Add billing profile"}
        </Button>
      </div>

      {adding ? (
        <Card className="shadow-none hover:border-border hover:bg-card">
          <form
            className="grid gap-4 px-5 py-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              saveProfile();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="profile-name">Profile name</Label>
              <Input
                id="profile-name"
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Wingify Finance"
                className="shadow-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardholder">Cardholder</Label>
              <Input
                id="cardholder"
                value={draft.holder}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, holder: event.target.value }))
                }
                placeholder="Name on card"
                className="shadow-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Card</Label>
              <Select
                value={draft.brand}
                onValueChange={(brand) => setDraft((current) => ({ ...current, brand }))}
              >
                <SelectTrigger id="brand" className="shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="last4">Last 4 digits</Label>
              <Input
                id="last4"
                inputMode="numeric"
                maxLength={4}
                value={draft.last4}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    last4: event.target.value.replace(/\D/g, "").slice(0, 4),
                  }))
                }
                placeholder="4242"
                className="shadow-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry</Label>
              <Input
                id="expiry"
                value={draft.expiry}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, expiry: event.target.value }))
                }
                placeholder="MM/YY"
                className="shadow-none"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" size="sm" className="shadow-none">
                Save card
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3">
        {profiles.map((profile) => {
          const invoices = invoicesForProfile(profile.id);
          const isDefault = profile.id === defaultId;
          return (
            <Card
              key={profile.id}
              className="shadow-none hover:border-border hover:bg-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-foreground">
                      {profile.name}
                    </h2>
                    {isDefault ? (
                      <Badge tone="neutral" fill="light" size="sm">
                        Default
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-foreground">
                    {profile.brand} ···· {profile.last4}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {profile.holder} · Expires {profile.expiry}
                  </p>
                </div>
                {isDefault ? null : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shadow-none"
                    onClick={() => setDefaultId(profile.id)}
                  >
                    Use for next invoice
                  </Button>
                )}
              </div>
              <div className="border-t border-border px-5 py-3">
                <p className="text-xs text-muted-foreground">
                  {invoiceSummary(invoices)}
                </p>
                {invoices.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-1">
                    {invoices.map((invoice) => (
                      <li key={invoice.id}>
                        <Link
                          to="/settings/subscription/invoice-history"
                          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-sm text-foreground hover:underline"
                        >
                          <span>
                            {invoice.id}
                            <span className="text-muted-foreground">
                              {" "}
                              · {invoice.description}
                            </span>
                          </span>
                          <span className="tabular-nums">{invoice.amount}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
