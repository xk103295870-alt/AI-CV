import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/__layout")({
  component: LayoutComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session?.user?.role || context.session.user.role !== "admin") {
      throw redirect({ to: "/admin/login", replace: true });
    }
  },
});

function LayoutComponent() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <nav style={{ 
        width: "200px", 
        background: "#1a1a1a", 
        color: "white",
        padding: "20px"
      }}>
        <h2 style={{ marginBottom: "20px" }}>管理后台</h2>
        <a href="/admin/overview" style={{ color: "white", display: "block", marginBottom: "10px" }}>概览</a>
        <a href="/admin/users" style={{ color: "white", display: "block", marginBottom: "10px" }}>用户管理</a>
        <hr style={{ margin: "20px 0", borderColor: "#333" }} />
        <a href="/" style={{ color: "#ff4444" }}>退出登录</a>
      </nav>
      <main style={{ flex: 1, padding: "20px", overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
