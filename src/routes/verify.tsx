import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, CheckCircle2, Loader2, Upload, Clock, CreditCard } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Verify Identity — AgriLink Solutions" }] }),
  validateSearch: z.object({ role: z.enum(["farmer", "buyer"]).optional() }),
  component: Verify,
});

type Phase = "form" | "uploading" | "pending" | "success";

const ID_TYPES = [
  { value: "Ghana Card", label: "Ghana Card (NIA)", hint: "GHA-XXXXXXXXX-X" },
  { value: "Voter ID", label: "Voter ID Card", hint: "XXXXXXXXXXXX" },
  { value: "NHIS Card", label: "NHIS Card", hint: "XXXXXXXXXXXXXXXX" },
  { value: "Driver's Licence", label: "Driver's Licence", hint: "XXXXXXXXXX" },
  { value: "Passport", label: "International Passport", hint: "GXXXXXXX" },
];

function Verify() {
  const { role: roleSearch } = Route.useSearch();
  const { user, profile, loading, refresh } = useAuth();
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [selectedIdType, setSelectedIdType] = useState("Ghana Card");
  const [idNumber, setIdNumber] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const role = roleSearch ?? profile?.role ?? "farmer";

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/signin" });
    // If already verified, skip to dashboard
    if (!loading && profile?.verification_status === "verified") {
      navigate({ to: role === "buyer" ? "/buyer/dashboard" : "/farmer/dashboard" });
    }
  }, [loading, user, profile, navigate, role]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be under 5MB");
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    if (!idNumber.trim()) {
      setError("Please enter your ID number");
      return;
    }

    setError(null);
    setPhase("uploading");

    try {
      // Update profile with ID details
      // In production: upload photo to Supabase Storage and send to a verification service
      // For now: set to "pending" — an admin reviews and flips to "verified"
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          id_type: selectedIdType,
          id_number: idNumber.trim(),
          // For demo: auto-verify. In production: set to "pending" and review manually
          verification_status: "verified",
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      await refresh();
      setPhase("success");
      setTimeout(() => {
        navigate({ to: role === "buyer" ? "/buyer/dashboard" : "/farmer/dashboard" });
      }, 1500);
    } catch (err: any) {
      setError(err.message ?? "Verification failed. Please try again.");
      setPhase("form");
    }
  }

  const selectedType = ID_TYPES.find((t) => t.value === selectedIdType);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-baseline gap-1.5 mb-4">
            <span className="font-display text-2xl font-bold text-[#2E7D32]">AgriLink</span>
            <span className="text-[10px] uppercase tracking-widest text-[#F9A825]">Solutions</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { n: 1, label: "Account" },
            { n: 2, label: "Verify ID" },
            { n: 3, label: "Dashboard" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                s.n === 2 ? "bg-[#2E7D32] text-white" : s.n < 2 ? "bg-[#2E7D32] text-white" : "bg-[#E2E8F0] text-[#94A3B8]"
              }`}>
                {s.n < 2 ? "✓" : s.n}
              </div>
              <span className={`text-xs ${s.n === 2 ? "text-[#1E293B] font-medium" : "text-[#94A3B8]"}`}>{s.label}</span>
              {i < 2 && <div className="h-px flex-1 bg-[#E2E8F0]" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">

          {/* ── FORM ── */}
          {phase === "form" && (
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5E9]">
                    <ShieldCheck className="h-5 w-5 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h1 className="font-display text-lg font-semibold text-[#1E293B]">Verify your identity</h1>
                    <p className="text-xs text-[#64748B]">Required by Bank of Ghana regulations</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* ID Type */}
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">ID document type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {ID_TYPES.map((t) => (
                      <label
                        key={t.value}
                        className={`flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                          selectedIdType === t.value
                            ? "border-[#2E7D32] bg-[#E8F5E9]"
                            : "border-[#E2E8F0] bg-white hover:border-[#4CAF50]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="id_type"
                          value={t.value}
                          checked={selectedIdType === t.value}
                          onChange={() => setSelectedIdType(t.value)}
                          className="sr-only"
                        />
                        <CreditCard className={`h-4 w-4 shrink-0 ${selectedIdType === t.value ? "text-[#2E7D32]" : "text-[#94A3B8]"}`} />
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${selectedIdType === t.value ? "text-[#1B5E20]" : "text-[#1E293B]"}`}>{t.label}</div>
                          <div className="text-xs text-[#94A3B8]">Format: {t.hint}</div>
                        </div>
                        {selectedIdType === t.value && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2E7D32]" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* ID Number */}
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                    {selectedType?.label} number
                  </label>
                  <input
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                    placeholder={selectedType?.hint}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm font-mono tracking-wider focus:border-[#2E7D32] outline-none"
                    required
                  />
                </div>

                {/* Photo upload */}
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                    ID photo <span className="text-[#94A3B8] font-normal">(optional but speeds up verification)</span>
                  </label>

                  {photoPreview ? (
                    <div className="relative rounded-lg overflow-hidden border border-[#E2E8F0]">
                      <img src={photoPreview} alt="ID preview" className="w-full h-32 object-cover" />
                      <button
                        type="button"
                        onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                        className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 text-xs text-[#64748B] hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-[#E2E8F0] p-6 cursor-pointer hover:border-[#2E7D32] hover:bg-[#F8FAFC] transition-colors">
                      <Upload className="h-6 w-6 text-[#94A3B8]" />
                      <div className="text-center">
                        <div className="text-sm text-[#64748B]">Tap to upload photo of your ID</div>
                        <div className="text-xs text-[#94A3B8] mt-1">PNG, JPG up to 5MB</div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>

                {/* Security note */}
                <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs text-[#64748B]">
                  🔒 Your ID is encrypted and only used for regulatory compliance. We never share it with buyers or farmers.
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#2E7D32] px-4 py-3 text-sm font-semibold text-white hover:bg-[#256528] transition-colors"
                >
                  Submit for verification
                </button>
              </div>
            </form>
          )}

          {/* ── UPLOADING ── */}
          {phase === "uploading" && (
            <div className="p-12 text-center">
              <Loader2 className="h-12 w-12 text-[#2E7D32] mx-auto animate-spin" />
              <h2 className="mt-6 font-display text-xl font-semibold text-[#1E293B]">Verifying your identity…</h2>
              <p className="mt-2 text-sm text-[#64748B]">Checking your {selectedIdType}</p>
            </div>
          )}

          {/* ── PENDING (for when auto-verify is off) ── */}
          {phase === "pending" && (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3C7]">
                <Clock className="h-8 w-8 text-[#F9A825]" />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold text-[#1E293B]">Under review</h2>
              <p className="mt-2 text-sm text-[#64748B] max-w-xs mx-auto">
                Your ID is being reviewed by our team. You'll receive an SMS once verified — usually within 2 hours.
              </p>
              <div className="mt-6 rounded-xl bg-[#E8F5E9] p-4 text-sm text-[#1B5E20]">
                📱 We'll send you an SMS to <strong>{profile?.phone ?? "your number"}</strong> when ready.
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {phase === "success" && (
            <div className="p-12 text-center">
              <CheckCircle2 className="h-16 w-16 text-[#2E7D32] mx-auto" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-[#2E7D32]">You're verified!</h2>
              <p className="mt-2 text-sm text-[#64748B]">Redirecting to your dashboard…</p>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-[#94A3B8]">
          Already verified? <a href="/signin" className="text-[#2E7D32] hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}