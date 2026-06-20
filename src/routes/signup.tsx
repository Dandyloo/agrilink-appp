import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, Store, Loader2 } from "lucide-react";
import { REGIONS } from "@/lib/seed";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — AgriLink Solutions" }] }),
  component: SignUp,
});

function SignUp() {
  const [role, setRole] = useState<"farmer" | "buyer" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!role) return;
    setError(null);
    setSubmitting(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "").trim();
    const password = String(f.get("password") || "");
    const full_name = String(f.get("full_name") || "").trim();
    const phone = String(f.get("phone") || "").trim();
    const region = String(f.get("region") || "");
    const cooperative_name = String(f.get("coop") || "").trim();

    if (!email) { setError("Email is required to create an account."); setSubmitting(false); return; }

    const { error: signErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/verify`,
        data: { full_name, phone, role, region, cooperative_name },
      },
    });
    setSubmitting(false);
    if (signErr) { setError(signErr.message); return; }
    navigate({ to: "/verify", search: { role } });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-[#2E7D32]">AgriLink</span>
            <span className="text-[10px] uppercase tracking-widest text-[#F9A825]">Solutions</span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-[#64748B] mt-1">Step 1 — Choose your role</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {([
            { id: "farmer", icon: Leaf, label: "I am a Farmer", desc: "List produce, access financing" },
            { id: "buyer", icon: Store, label: "I am a Buyer", desc: "Source produce, manage procurement" },
          ] as const).map((r) => {
            const active = role === r.id;
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`text-left rounded-xl p-4 border-2 transition-all ${active ? "border-[#2E7D32] bg-[#E8F5E9]" : "border-[#E2E8F0] bg-white hover:border-[#4CAF50]"}`}
              >
                <Icon className={`h-6 w-6 ${active ? "text-[#2E7D32]" : "text-[#64748B]"}`} />
                <div className="mt-2 font-display font-semibold text-[#1E293B]">{r.label}</div>
                <div className="text-xs text-[#64748B] mt-1">{r.desc}</div>
              </button>
            );
          })}
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <Field label="Full name" required><input name="full_name" required className="input" placeholder="e.g. Kwame Asante" /></Field>
          <Field label="Phone number" required><input name="phone" required type="tel" className="input" placeholder="+233 XX XXX XXXX" /></Field>
          <Field label="Email address" required><input name="email" required type="email" className="input" placeholder="you@example.com" /></Field>
          {role === "farmer" && (
            <Field label="Cooperative name"><input name="coop" className="input" placeholder="e.g. Brong Farmers Union" /></Field>
          )}
          <Field label="Region" required>
            <select name="region" required className="input">
              <option value="">Select region</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Password" required><input name="password" required type="password" minLength={6} className="input" /></Field>

          {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

          <button type="submit" disabled={!role || submitting} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white hover:bg-[#256528] disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Create account
          </button>
          <p className="text-center text-sm text-[#64748B]">
            Already have an account? <Link to="/signin" className="text-[#2E7D32] font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
      <style>{`
        .input { width: 100%; padding: 0.625rem 0.875rem; border: 1px solid #E2E8F0; border-radius: 0.5rem; background: white; font-size: 0.875rem; color: #1E293B; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #2E7D32; box-shadow: 0 0 0 3px rgba(46,125,50,0.1); }
      `}</style>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[#1E293B] mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-xs text-[#64748B] ml-1">({hint})</span>}
      </span>
      {children}
    </label>
  );
}
