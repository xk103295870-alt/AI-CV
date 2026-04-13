import { redirect } from "@tanstack/react-router";

import type { AuthSession } from "@/integrations/auth/types";

export function requireAdmin(session: AuthSession | null) {
  if (!session?.user?.role || session.user.role !== "admin") {
    throw redirect({ to: "/admin/login", replace: true });
  }
}
