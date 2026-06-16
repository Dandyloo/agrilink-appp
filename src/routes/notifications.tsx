import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/notifications")({
  component: () => <Navigate to="/farmer/notifications" />,
});
