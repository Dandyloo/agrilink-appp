import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { REGIONS } from "@/lib/seed";
import { useAuth, initials } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/farmer/settings")({
  head: () => ({ meta: [{ title: "Settings — AgriLink" }] }),
  component: Settings,
});

function Settings() {
  const { user, profile, refresh } = useAuth();
  const qc = useQueryClient();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: async (payload: { full_name: string; phone: string; email: string | null; region: string; cooperative_name: string }) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
      if (error) throw error;
      await refresh();
      qc.invalidateQueries();
    },
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      await save.mutateAsync({
        full_name: String(f.get("full_name") || ""),
        phone: String(f.get("phone") || ""),
        email: String(f.get("email") || "") || null,
        region: String(f.get("region") || ""),
        cooperative_name: String(f.get("coop") || ""),
      });
      setDone(true); setTimeout(() => setDone(false), 2500);
    } catch (e: any) { setError(e.message); }
  }

  if (!profile) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-display text-2xl font-semibold">Settings</h1>

      <Card title="Profile">
        <form onSubmit={onSubmit}>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2E7D32] text-xl font-semibold text-white">{initials(profile.full_name)}</div>
            <div>
              <div className="font-display font-semibold">{profile.full_name}</div>
              <div className="text-xs text-[#64748B] capitalize">{profile.region ?? ""} · {profile.verification_status}</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Full name"><input name="full_name" required className="input" defaultValue={profile.full_name} /></Field>
            <Field label="Phone"><input name="phone" className="input" defaultValue={profile.phone ?? ""} /></Field>
            <Field label="Email"><input name="email" type="email" className="input" defaultValue={profile.email ?? ""} /></Field>
            <Field label="Region"><select name="region" className="input" defaultValue={profile.region ?? ""}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
            <Field label="Cooperative"><input name="coop" className="input" defaultValue={profile.cooperative_name ?? ""} /></Field>
          </div>
          {error && <div className="mt-3 text-xs text-red-600">{error}</div>}
          {done && <div className="mt-3 text-xs text-[#2E7D32]">✓ Saved</div>}
          <button disabled={save.isPending} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
          </button>
        </form>
      </Card>

      <Card title="Notifications">
        <NotificationPrefs />
      </Card>

      <style>{`.input { width:100%; padding:0.5rem 0.75rem; border:1px solid #E2E8F0; border-radius:0.5rem; background:white; font-size:0.875rem; outline:none } .input:focus { border-color:#2E7D32 }`}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-[#E2E8F0] bg-white p-5"><h3 className="font-display font-semibold mb-4">{title}</h3>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block mb-3"><span className="block text-sm font-medium text-[#1E293B] mb-1.5">{label}</span>{children}</label>;
}

function NotificationPrefs() {
  const { user, profile, refresh } = useAuth();
  const prefs = profile?.notification_prefs ?? { orders: true, prices: true, finance: true, marketing: false };
  const save = useMutation({
    mutationFn: async (next: Record<string, boolean>) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("profiles").update({ notification_prefs: next as any }).eq("id", user.id);
      if (error) throw error;
      await refresh();
    },
  });
  const items: { key: "orders" | "prices" | "finance" | "marketing"; label: string }[] = [
    { key: "orders", label: "Order alerts" },
    { key: "prices", label: "Price alerts" },
    { key: "finance", label: "Finance updates" },
    { key: "marketing", label: "Marketing emails" },
  ];
  return (
    <>
      {items.map((it) => {
        const on = (prefs as any)[it.key] ?? false;
        return (
          <div key={it.key} className="flex items-center justify-between py-2.5 border-b border-[#E2E8F0] last:border-0">
            <span className="text-sm">{it.label}</span>
            <button
              type="button"
              disabled={save.isPending}
              onClick={() => save.mutate({ ...prefs, [it.key]: !on })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition disabled:opacity-60 ${on ? "bg-[#2E7D32]" : "bg-slate-300"}`}
              aria-pressed={on}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${on ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        );
      })}
    </>
  );
}
