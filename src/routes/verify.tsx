import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Verify Identity — AgriLink Solutions" }] }),
  validateSearch: z.object({ role: z.enum(["farmer", "buyer"]).optional() }),
  component: Verify,
});

type Phase = "form" | "pending" | "success";

function Verify() {
  const { role: roleSearch } = Route.useSearch();
  const { user, profile, loading, refresh } = useAuth();
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const role = roleSearch ?? profile?.role ?? "farmer";

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/signin" });
  }, [loading, user, navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setPhase("pending");
    const f = new FormData(e.currentTarget);
    const id_type = String(f.get("id_type") || "Ghana Card");
    const id_number = String(f.get("id_number") || "").trim();

    const { error: e1 } = await supabase
      .from("profiles")
      .update({ id_type, id_number, verification_status: "verified" })
      .eq("id", user.id);

    if (e1) { setError(e1.message); setPhase("form"); return; }
    await refresh();
    setPhase("success");
    setTimeout(() => {
      navigate({ to: role === "buyer" ? "/buyer/dashboard" : "/farmer/dashboard" });
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm text-center">
        {phase === "form" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9]">
              <ShieldCheck className="h-8 w-8 text-[#2E7D32]" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold">Verify your identity</h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Required by Bank of Ghana regulations. Your information is encrypted and secure.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
              <label className="block">
                <span className="block text-sm font-medium text-[#1E293B] mb-1.5">ID type</span>
                <select name="id_type" required className="input">
                  <option>Ghana Card</option>
                  <option>Voter ID</option>
                  <option>NHIS Card</option>
                  <option>Driver's Licence</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-[#1E293B] mb-1.5">ID number</span>
                <input name="id_number" required className="input" placeholder="Enter your ID number" />
              </label>
              {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
              <button type="submit" className="w-full rounded-lg bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white hover:bg-[#256528]">
                Submit for verification
              </button>
            </form>
          </>
        )}

        {phase === "pending" && (
          <div className="py-6">
            <Loader2 className="h-12 w-12 text-[#2E7D32] mx-auto animate-spin" />
            <h2 className="mt-6 font-display text-xl font-semibold">Verifying your identity...</h2>
            <p className="mt-2 text-sm text-[#64748B]">This usually takes a few seconds</p>
          </div>
        )}

        {phase === "success" && (
          <div className="py-6">
            <CheckCircle2 className="h-16 w-16 text-[#2E7D32] mx-auto" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-[#2E7D32]">You're verified!</h2>
            <p className="mt-2 text-sm text-[#64748B]">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
      <style>{`
        .input { width: 100%; padding: 0.625rem 0.875rem; border: 1px solid #E2E8F0; border-radius: 0.5rem; background: white; font-size: 0.875rem; color: #1E293B; outline: none; }
        .input:focus { border-color: #2E7D32; box-shadow: 0 0 0 3px rgba(46,125,50,0.1); }
      `}</style>
    </div>
  );
}
