import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { UsersIcon, LayoutDashboardIcon, SignOutIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import { Link } from "@tanstack/react-router";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Button } from "@/components/ui/button";
import { authClient } from "@/integrations/auth/client";

export const Route = createFileRoute("/admin/__layout")({
  component: AdminLayout,
  beforeLoad: async ({ context }) => {
    if (!context.session?.user?.role || context.session.user.role !== "admin") {
      throw redirect({ to: "/admin/login", replace: true });
    }
  },
});

function AdminLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("已退出登录");
    router.navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="flex h-full w-64 flex-col border-r bg-background">
        {/* Header */}
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <BrandIcon variant="icon" className="size-6" />
          <span className="font-semibold">管理后台</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-2 text-xs font-medium text-muted-foreground">菜单</div>
          <nav className="space-y-1">
            <Link
              to="/admin/overview"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              <LayoutDashboardIcon className="size-4" />
              概览
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              <UsersIcon className="size-4" />
              用户管理
            </Link>
          </nav>
        </div>

        {/* Footer with Logout */}
        <div className="border-t p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span>当前用户:</span>
          </div>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            <SignOutIcon className="mr-2 size-4" />
            退出登录
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="h-full flex-1 overflow-auto bg-muted/20 p-6">
        <Outlet />
      </main>
    </div>
  );
}
