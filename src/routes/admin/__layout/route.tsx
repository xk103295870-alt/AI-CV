import { createFileRoute, Outlet, redirect, useRouter, useRouteContext } from "@tanstack/react-router";
import { UsersIcon, LayoutDashboardIcon, SettingsIcon, SignOutIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarRail, SidebarFooter } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/integrations/auth/client";

const adminNavItems = [
  { icon: LayoutDashboardIcon, label: "概览", href: "/admin/overview" },
  { icon: UsersIcon, label: "用户管理", href: "/admin/users" },
  { icon: SettingsIcon, label: "系统设置", href: "/admin/settings" },
];

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
  const { session } = useRouteContext({ from: "/admin/__layout" });

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("已退出登录");
    router.navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        {/* Header */}
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <BrandIcon variant="icon" className="size-6" />
          <span className="font-semibold">管理后台</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-4">
          <div className="mb-2 text-xs font-medium text-muted-foreground">菜单</div>
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <Separator className="my-4" />

        {/* User Info */}
        <div className="px-4 py-2">
          <div className="mb-2 text-xs font-medium text-muted-foreground">当前用户</div>
          <div className="flex items-center gap-2 rounded-md bg-muted p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-medium">{session.user.name.charAt(0)}</span>
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium">{session.user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleLogout}
          >
            <SignOutIcon className="size-4" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 overflow-auto bg-muted/20 p-6">
        <Outlet />
      </main>
    </div>
  );
}
