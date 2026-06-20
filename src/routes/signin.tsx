import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [{ title: "Sign In — AgriLink Solutions" }] }),
  component: SignIn,
});

function SignIn() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "").trim();
    const password = String(f.get("password") || "");
    const { data, error: e1 } = await supabase.auth.signInWithPassword({ email, password });
    if (e1 || !data.user) { setError(e1?.message ?? "Sign in failed"); setSubmitting(false); return; }
    const { data: prof } = await supabase.from("profiles").select("role,verification_status").eq("id", data.user.id).maybeSingle();
    setSubmitting(false);
    if (!prof) { navigate({ to: "/verify", search: { role: "farmer" } }); return; }
    if (prof.verification_status !== "verified") { navigate({ to: "/verify", search: { role: prof.role as "farmer" | "buyer" } }); return; }
    navigate({ to: prof.role === "buyer" ? "/buyer/dashboard" : "/farmer/dashboard" });
  }

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

        <form className="space-y-4" onSubmit={onSubmit}>
          <Field label="Email address"><input name="email" type="email" required className="input" placeholder="you@example.com" /></Field>
          <Field label="Password"><input name="password" type="password" required className="input" /></Field>
          {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
          <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white hover:bg-[#256528] disabled:opacity-60">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
          <p className="text-center text-sm text-[#64748B]">
            Don't have an account? <Link to="/signup" className="text-[#2E7D32] font-medium hover:underline">Create one</Link>
          </p>
        </form>
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
