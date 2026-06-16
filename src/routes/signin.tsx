import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [{ title: "Sign In — AgriLink Solutions" }] }),
  component: SignIn,
});

function SignIn() {
  const [mode, setMode] = useState<"email" | "phone">("phone");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-[#2E7D32]">AgriLink</span>
            <span className="text-[10px] uppercase tracking-widest text-[#F9A825]">Solutions</span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Welcome back</h1>
        </div>

        <div className="flex rounded-lg bg-[#F1F5F9] p-1 mb-4">
          {(["email", "phone"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === m ? "bg-white text-[#1E293B] shadow-sm" : "text-[#64748B]"}`}
            >
              {m === "email" ? "Email" : "Phone Number"}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/farmer/dashboard" }); }}>
          {mode === "email" ? (
            <Field label="Email address"><input type="email" required className="input" placeholder="you@example.com" /></Field>
          ) : (
            <Field label="Phone number"><input type="tel" required className="input" placeholder="+233 XX XXX XXXX" /></Field>
          )}
          <div>
            <Field label="Password"><input type="password" required className="input" /></Field>
            <div className="text-right mt-1.5">
              <a href="#" className="text-xs text-[#2E7D32] font-medium hover:underline">Forgot password?</a>
            </div>
          </div>
          <button type="submit" className="w-full rounded-lg bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white hover:bg-[#256528]">
            Sign in
          </button>
          <p className="text-center text-sm text-[#64748B]">
            Don't have an account? <Link to="/signup" className="text-[#2E7D32] font-medium hover:underline">Create one</Link>
          </p>
        </form>

        <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex gap-2">
          <Link to="/farmer/dashboard" className="flex-1 text-center text-xs rounded-md bg-[#F1F5F9] py-2 hover:bg-[#E2E8F0]">Preview Farmer →</Link>
          <Link to="/buyer/dashboard" className="flex-1 text-center text-xs rounded-md bg-[#F1F5F9] py-2 hover:bg-[#E2E8F0]">Preview Buyer →</Link>
        </div>
      </div>
      <style>{`
        .input { width: 100%; padding: 0.625rem 0.875rem; border: 1px solid #E2E8F0; border-radius: 0.5rem; background: white; font-size: 0.875rem; color: #1E293B; outline: none; }
        .input:focus { border-color: #2E7D32; box-shadow: 0 0 0 3px rgba(46,125,50,0.1); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[#1E293B] mb-1.5">{label}</span>
      {children}
    </label>
  );
}
