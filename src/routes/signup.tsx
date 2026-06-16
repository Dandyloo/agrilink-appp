import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, Store } from "lucide-react";
import { REGIONS } from "@/lib/seed";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — AgriLink Solutions" }] }),
  component: SignUp,
});

function SignUp() {
  const [role, setRole] = useState<"farmer" | "buyer" | null>(null);
  const navigate = useNavigate();

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
                onClick={() => setRole(r.id)}
                className={`text-left rounded-xl p-4 border-2 transition-all ${
                  active ? "border-[#2E7D32] bg-[#E8F5E9]" : "border-[#E2E8F0] bg-white hover:border-[#4CAF50]"
                }`}
              >
                <Icon className={`h-6 w-6 ${active ? "text-[#2E7D32]" : "text-[#64748B]"}`} />
                <div className="mt-2 font-display font-semibold text-[#1E293B]">{r.label}</div>
                <div className="text-xs text-[#64748B] mt-1">{r.desc}</div>
              </button>
            );
          })}
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/verify", search: { role: role ?? "farmer" } }); }}>
          <Field label="Full name" required><input required className="input" placeholder="e.g. Kwame Asante" /></Field>
          <Field label="Phone number" required><input required type="tel" className="input" placeholder="+233 XX XXX XXXX" /></Field>
          <Field label="Email address" hint="optional"><input type="email" className="input" placeholder="you@example.com" /></Field>
          {role === "farmer" && (
            <Field label="Cooperative name"><input className="input" placeholder="e.g. Brong Farmers Union" /></Field>
          )}
          <Field label="Region" required>
            <select required className="input">
              <option value="">Select region</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Password" required><input required type="password" className="input" /></Field>

          <button type="submit" disabled={!role} className="w-full rounded-lg bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white hover:bg-[#256528] disabled:opacity-50 disabled:cursor-not-allowed">
            Create account
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
