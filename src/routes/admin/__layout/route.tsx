import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { UsersIcon, LayoutDashboardIcon, SettingsIcon, SignOutIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarRail, SidebarFooter } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Button } from "@/components/ui/button";
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

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("已退出登录");
    router.navigate({ to: "/admin/login", replace: true });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-2 px-2 py-3">
                  <BrandIcon variant="icon" className="size-6" />
                  <span className="font-semibold">管理后台</span>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>菜单</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={
                          <Link to={item.href} activeProps={{ className: "bg-sidebar-accent" }}>
                            <item.icon className="size-4" />
                            <span>{item.label}</span>
                          </Link>
                        }
                      />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <SignOutIcon className="size-4" />
              <span>退出登录</span>
            </Button>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <main className="flex-1 overflow-auto bg-muted/20 p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
