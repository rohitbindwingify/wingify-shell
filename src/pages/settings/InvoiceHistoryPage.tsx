/** Settings → Subscription & Invoices → Invoice History. */

import { Link } from "react-router-dom";
import { Download } from "@/components/icons/protoLucide";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { billingProfileById, INVOICES } from "@/data/billingProfiles";

export default function InvoiceHistoryPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-8 py-6">
      <Card className="overflow-hidden shadow-none hover:border-border hover:bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Billing profile</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">
                <span className="sr-only">Download</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((invoice) => {
              const profile = billingProfileById(invoice.profileId);
              return (
                <tr key={invoice.id} className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">{invoice.date}</td>
                  <td className="px-4 py-3 text-foreground">{invoice.id}</td>
                  <td className="px-4 py-3 text-foreground">{invoice.description}</td>
                  <td className="px-4 py-3">
                    {profile ? (
                      <Link
                        to="/settings/subscription/billing-profile"
                        className="whitespace-nowrap text-foreground hover:underline"
                      >
                        {profile.name}
                        <span className="text-muted-foreground">
                          {" "}
                          ···· {profile.last4}
                        </span>
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground">
                    {invoice.amount}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={invoice.status === "Overdue" ? "cherry" : "green"}
                      fill="light"
                      size="sm"
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shadow-none"
                      aria-label={`Download ${invoice.id}`}
                    >
                      <Download className="size-4" strokeWidth={1.75} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
