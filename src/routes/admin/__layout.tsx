import { createFileRoute, redirect } from "@tanstack/react-router";

import { requireAdmin } from "@/routes/admin/-utils/require-admin";

export const Route = createFileRoute("/admin/__layout")({
  beforeLoad: async ({ context }) => {
    requireAdmin(context.session);
    throw redirect({ to: "/admin/overview", replace: true });
  },
});
