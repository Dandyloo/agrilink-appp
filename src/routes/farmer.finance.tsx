// src/routes/farmer.finance.tsx  — UPGRADED
// Changes from original:
//  • Added "Calculator" tab with LoanCalculator component
//  • Past applications now show status chips with colour
//  • Improved layout and descriptions
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ghs } from "@/lib/seed";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoanCalculator } from "@/components/loan-calculator";

export const Route = createFileRoute("/farmer/finance")({
  head: () => ({ meta: [{ title: "Finance Hub — AgriLink" }] }),
  component: FinanceHub,
});

type Tab = "input" | "invoice" | "insurance" | "calculator";

const TABS: { id: Tab; label: string }[] = [
  { id: "input", label: "Input Credit" },
  { id: "invoice", label: "Invoice Financing" },
  { id: "insurance", label: "Crop Insurance" },
  { id: "calculator", label: "Calculator" },
];

function FinanceHub() {
  const [tab, setTab] = useState<Tab>("input");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Finance Hub</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Access credit, invoice financing and crop insurance
        </p>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-[#E8F5E9] border-l-4 border-l-[#2E7D32] p-4 text-sm text-[#1E293B]">
        Powered by <strong>AgriLink Finance</strong> — partnered with BOG-licensed
        micro-finance institutions
      </div>

      <div className="flex gap-2 border-b border-[#E2E8F0] overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              tab === t.id
                ? "border-[#2E7D32] text-[#2E7D32]"
                : "border-transparent text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "input" && <InputCredit />}
      {tab === "invoice" && <InvoiceFinance />}
      {tab === "insurance" && <Insurance />}
      {tab === "calculator" && <LoanCalculator />}

      {tab !== "calculator" && <PastApplications />}
    </div>
  );
}

function useSubmitApplication() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      type: "input_credit" | "invoice_financing" | "insurance";
      amount: number;
      crop_type?: string;
      buyer_name?: string;
      delivery_date?: string | null;
      notes?: string;
    }) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("credit_applications").insert({
        ...payload,
        farmer_id: user.id,
        status: "submitted",
      });
      if (error) throw error;
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Application submitted",
        description: `Your ${payload.type.replace(/_/g, " ")} application for GHS ${payload.amount.toLocaleString()} is under review.`,
        kind: "Finance",
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["credit-apps"] }),
  });
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#1E293B]">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-sm focus:border-[#2E7D32] outline-none";

function SubmitBtn({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 hover:bg-[#256528]"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Submit application
    </button>
  );
}

function InputCredit() {
  const submit = useSubmitApplication();
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await submit.mutateAsync({
      type: "input_credit",
      amount: Number(f.get("amount") || 0),
      crop_type: String(f.get("crop_type") || ""),
      notes: String(f.get("notes") || ""),
    });
    setDone(true);
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setDone(false), 3000);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
      <p className="text-sm text-[#64748B]">
        Get credit to purchase seeds, fertiliser, and equipment before harvest
        season.
      </p>
      {done && (
        <div className="rounded-lg bg-[#E8F5E9] border border-[#A5D6A7] p-3 text-sm text-[#1B5E20]">
          ✓ Application submitted successfully!
        </div>
      )}
      <Field label="Loan amount (GHS)">
        <input name="amount" type="number" min="500" required placeholder="e.g. 5000" className={inputCls} />
      </Field>
      <Field label="Intended crop">
        <input name="crop_type" placeholder="e.g. Maize" className={inputCls} />
      </Field>
      <Field label="Notes (optional)">
        <textarea name="notes" rows={3} placeholder="What will you use this for?" className={`${inputCls} resize-none`} />
      </Field>
      <SubmitBtn pending={submit.isPending} />
    </form>
  );
}

function InvoiceFinance() {
  const submit = useSubmitApplication();
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await submit.mutateAsync({
      type: "invoice_financing",
      amount: Number(f.get("amount") || 0),
      buyer_name: String(f.get("buyer_name") || ""),
      delivery_date: String(f.get("delivery_date") || "") || null,
      notes: String(f.get("notes") || ""),
    });
    setDone(true);
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setDone(false), 3000);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
      <p className="text-sm text-[#64748B]">
        Get paid early on outstanding invoices. Upload the invoice and receive
        up to 80% upfront.
      </p>
      {done && (
        <div className="rounded-lg bg-[#E8F5E9] border border-[#A5D6A7] p-3 text-sm text-[#1B5E20]">
          ✓ Invoice financing request submitted!
        </div>
      )}
      <Field label="Invoice value (GHS)">
        <input name="amount" type="number" min="100" required placeholder="e.g. 12000" className={inputCls} />
      </Field>
      <Field label="Buyer / company name">
        <input name="buyer_name" required placeholder="Buyer or company" className={inputCls} />
      </Field>
      <Field label="Expected delivery date">
        <input name="delivery_date" type="date" className={inputCls} />
      </Field>
      <Field label="Notes (optional)">
        <textarea name="notes" rows={2} className={`${inputCls} resize-none`} />
      </Field>
      <SubmitBtn pending={submit.isPending} />
    </form>
  );
}

function Insurance() {
  const submit = useSubmitApplication();
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await submit.mutateAsync({
      type: "insurance",
      amount: Number(f.get("amount") || 0),
      crop_type: String(f.get("crop_type") || ""),
      notes: String(f.get("notes") || ""),
    });
    setDone(true);
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setDone(false), 3000);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
      <p className="text-sm text-[#64748B]">
        Index-based crop insurance protects against drought, flooding, and other
        weather risks. Payouts are triggered automatically by satellite data.
      </p>
      {done && (
        <div className="rounded-lg bg-[#E8F5E9] border border-[#A5D6A7] p-3 text-sm text-[#1B5E20]">
          ✓ Insurance application submitted!
        </div>
      )}
      <Field label="Crop value to insure (GHS)">
        <input name="amount" type="number" min="500" required placeholder="e.g. 20000" className={inputCls} />
      </Field>
      <Field label="Crop type">
        <input name="crop_type" required placeholder="e.g. Maize" className={inputCls} />
      </Field>
      <Field label="Additional notes">
        <textarea name="notes" rows={2} placeholder="Farm size, location, risk factors..." className={`${inputCls} resize-none`} />
      </Field>
      <SubmitBtn pending={submit.isPending} />
    </form>
  );
}

const STATUS_STYLE: Record<string, string> = {
  submitted: "bg-[#FEF3C7] text-[#92400E]",
  under_review: "bg-[#DBEAFE] text-[#1E40AF]",
  approved: "bg-[#D1FAE5] text-[#065F46]",
  rejected: "bg-[#FEE2E2] text-red-700",
};

function PastApplications() {
  const { user } = useAuth();
  const uid = user?.id;

  const { data: apps = [] } = useQuery({
    queryKey: ["credit-apps", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("credit_applications")
        .select("*")
        .eq("farmer_id", uid!)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  if (apps.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-display font-semibold">Past applications</h3>
      <div className="space-y-2">
        {apps.map((a: any) => (
          <div
            key={a.id}
            className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex items-start justify-between gap-3"
          >
            <div>
              <div className="font-medium text-sm capitalize">
                {String(a.type).replace(/_/g, " ")}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">
                {ghs(Number(a.amount))} ·{" "}
                {new Date(a.created_at).toLocaleDateString("en-GH")}
              </div>
              {a.notes && (
                <div className="text-xs text-[#64748B] mt-1 line-clamp-1">{a.notes}</div>
              )}
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                STATUS_STYLE[a.status] ?? "bg-[#F1F5F9] text-[#64748B]"
              }`}
            >
              {String(a.status).replace(/_/g, " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}