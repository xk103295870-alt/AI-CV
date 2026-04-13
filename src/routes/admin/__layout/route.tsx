import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { UsersIcon, LayoutDashboardIcon, SignOutIcon, UserCircleIcon } from "@phosphor-icons/react";
import { useState } from "react";

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
    return { user: context.session.user };
  },
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {/* 侧边栏 */}
      <aside style={{ 
        width: "256px", 
        display: "flex", 
        flexDirection: "column",
        borderRight: "1px solid var(--border)",
        backgroundColor: "var(--card)"
      }}>
        {/* Logo */}
        <div style={{ 
          height: "64px", 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          padding: "0 24px",
          borderBottom: "1px solid var(--border)"
        }}>
          <BrandIcon variant="icon" style={{ width: "28px", height: "28px" }} />
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>管理后台</span>
        </div>

        {/* 菜单 */}
        <nav style={{ flex: 1, padding: "16px" }}>
          <div style={{ 
            marginBottom: "12px", 
            padding: "0 12px",
            fontSize: "12px", 
            fontWeight: 600,
            textTransform: "uppercase",
            color: "var(--muted-foreground)"
          }}>
            功能菜单
          </div>
          
          <MenuLink to="/admin/overview" icon={LayoutDashboardIcon} label="数据概览" />
          <MenuLink to="/admin/users" icon={UsersIcon} label="用户管理" />
        </nav>

        {/* 底部用户区 */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
          {/* 用户信息 */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            marginBottom: "16px",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "var(--muted)"
          }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "50%",
              backgroundColor: "var(--primary-10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <UserCircleIcon style={{ width: "20px", height: "20px", color: "var(--primary)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </p>
            </div>
          </div>
          
          {/* 退出按钮 */}
          <Button 
            variant="outline" 
            disabled={isLoggingOut}
            onClick={handleLogout}
            style={{ width: "100%", justifyContent: "flex-start", gap: "8px" }}
          >
            <SignOutIcon style={{ width: "16px", height: "16px" }} />
            {isLoggingOut ? "退出中..." : "退出登录"}
          </Button>
        </div>
      </aside>

      {/* 主内容 */}
      <main style={{ flex: 1, overflow: "auto", padding: "32px", backgroundColor: "var(--muted)" }}>
        <Outlet />
      </main>
    </div>
  );
}

// 菜单链接
function MenuLink({ 
  to, 
  icon: Icon, 
  label 
}: { 
  to: string; 
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  label: string;
}) {
  return (
    <Link
      to={to}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "12px",
        padding: "10px 12px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: 500,
        color: "var(--muted-foreground)",
        textDecoration: "none"
      }}
      activeProps={{ 
        style: { 
          backgroundColor: "var(--primary)", 
          color: "var(--primary-foreground)" 
        } 
      }}
    >
      <Icon style={{ width: "20px", height: "20px" }} />
      {label}
    </Link>
  );
}
