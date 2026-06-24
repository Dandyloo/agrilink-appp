import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

// This route is the PWA's start_url (see public/manifest.webmanifest).
// Regular web visitors land on "/" and see the marketing page; the
// installed app launches here instead and skips straight to the right
// screen based on auth state, so the app never shows the landing page.
export const Route = createFileRoute("/app-entry")({
  component: AppEntry,
});

function AppEntry() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate({ to: "/signin" });
      return;
    }

    if (profile?.role === "buyer") {
      navigate({ to: "/buyer/dashboard" });
    } else {
      // Default to farmer dashboard while the profile is still loading,
      // or if the role is farmer.
      navigate({ to: "/farmer/dashboard" });
    }
  }, [user, profile, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm text-[#64748B]">
      Loading…
    </div>
  );
}
