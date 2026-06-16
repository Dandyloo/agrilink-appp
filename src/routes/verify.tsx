import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Verify Identity — AgriLink Solutions" }] }),
  validateSearch: z.object({ role: z.enum(["farmer", "buyer"]).optional() }),
  component: Verify,
});

type Phase = "form" | "pending" | "success";

function Verify() {
  const { role } = Route.useSearch();
  const [phase, setPhase] = useState<Phase>("form");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhase("pending");
    setTimeout(() => {
      setPhase("success");
      setTimeout(() => {
        navigate({ to: role === "buyer" ? "/buyer/dashboard" : "/farmer/dashboard" });
      }, 1200);
    }, 2000);
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
                <select required className="input">
                  <option>Ghana Card</option>
                  <option>Voter ID</option>
                  <option>NHIS Card</option>
                  <option>Driver's Licence</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-[#1E293B] mb-1.5">ID number</span>
                <input required className="input" placeholder="Enter your ID number" />
              </label>
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
            <div className="mt-4 rounded-lg bg-[#FFF8E1] border border-[#F9A825]/30 p-3 text-xs text-[#7A5C0E]">
              ⏳ Verification Pending
            </div>
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
