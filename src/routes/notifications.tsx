import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/notifications")({
  component: NotificationsRedirect,
});

function NotificationsRedirect() {
  const { loading, user, profile } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/signin" });
    else if (profile?.role === "buyer") navigate({ to: "/buyer/notifications" });
    else navigate({ to: "/farmer/notifications" });
  }, [loading, user, profile, navigate]);
  return <div className="flex min-h-screen items-center justify-center text-sm text-[#64748B]">Loading…</div>;
}
