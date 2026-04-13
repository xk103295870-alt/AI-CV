import type React from "react";

import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { authClient } from "@/integrations/auth/client";

const navItems = [
  { label: "概览", to: "/admin/overview" },
  { label: "用户管理", to: "/admin/users" },
] as const;

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function AdminShell({ title, description, actions, children }: Props) {
  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-svh bg-background">
      <div className="flex w-full">
        <aside className="hidden min-h-svh w-64 shrink-0 border-r bg-card/40 p-4 lg:flex lg:flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">管理后台</h2>
            <p className="text-xs text-muted-foreground">Admin Console</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{
                  className: "block rounded-md bg-accent px-3 py-2 text-sm font-medium text-foreground",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t pt-4">
            <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          <nav className="mb-4 flex items-center gap-2 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex h-8 items-center rounded-md border px-3 text-xs text-muted-foreground"
                activeProps={{ className: "inline-flex h-8 items-center rounded-md bg-accent px-3 text-xs text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="ghost" className="ms-auto h-8 px-3 text-xs text-destructive" onClick={handleLogout}>
              退出
            </Button>
          </nav>

          <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {actions}
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
