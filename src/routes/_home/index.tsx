import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_home/")({
  beforeLoad: async ({ context }) => {
    // 如果已登录，跳转到仪表盘
    if (context.session) {
      throw redirect({ to: "/dashboard", replace: true });
    }
    // 未登录，跳转到登录页
    throw redirect({ to: "/auth/login", replace: true });
  },
});
