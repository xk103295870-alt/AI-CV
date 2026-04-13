import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { ShieldIcon, UsersIcon, LayoutDashboardIcon, SettingsIcon } from "@phosphor-icons/react";

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarRail } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { BrandIcon } from "@/components/ui/brand-icon";

const adminNavItems = [
  { icon: LayoutDashboardIcon, label: "概览", href: "/admin/overview" },
  { icon: UsersIcon, label: "用户管理", href: "/admin/users" },
  { icon: SettingsIcon, label: "系统设置", href: "/admin/settings" },
];

export const Route = createFileRoute("/admin/__layout")({
  component: AdminLayout,
  beforeLoad: async ({ context }) => {
    // 检查是否是管理员
    if (!context.session?.user?.role || context.session.user.role !== "admin") {
      throw redirect({ to: "/admin/login", replace: true });
    }
  },
});

function AdminLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        {/* Admin Sidebar */}
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
                      <SidebarMenuButton asChild>
                        <Link to={item.href} activeProps={{ className: "bg-sidebar-accent" }}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarRail />
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-muted/20 p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
