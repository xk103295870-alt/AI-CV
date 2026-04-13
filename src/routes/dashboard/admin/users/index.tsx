import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { UsersIcon, CheckCircleIcon, XCircleIcon, ShieldIcon, UserIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/integrations/orpc/client";

import { DashboardHeader } from "../../-components/header";

export const Route = createFileRoute("/dashboard/admin/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery(
    orpc.admin.users.list.queryOptions()
  );

  return (
    <div className="space-y-4">
      <DashboardHeader icon={UsersIcon} title={t`User Management`} />

      <Separator />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans>Total Users</Trans>
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-16" /> : data?.total ?? 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Registered Users</Trans>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-center text-sm text-destructive">
                <Trans>Failed to load users. Please try again.</Trans>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">
                        <Trans>User</Trans>
                      </th>
                      <th className="py-3 text-left font-medium">
                        <Trans>Email</Trans>
                      </th>
                      <th className="py-3 text-center font-medium">
                        <Trans>Status</Trans>
                      </th>
                      <th className="py-3 text-center font-medium">
                        <Trans>Role</Trans>
                      </th>
                      <th className="py-3 text-right font-medium">
                        <Trans>Registered</Trans>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.users.map((user) => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <UserIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{user.email}</span>
                            {user.emailVerified ? (
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircleIcon className="h-4 w-4 text-amber-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          {user.banned ? (
                            <Badge variant="destructive">
                              <Trans>Banned</Trans>
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-500">
                              <Trans>Active</Trans>
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {user.role === "admin" ? (
                            <Badge variant="outline" className="border-primary text-primary">
                              <ShieldIcon className="mr-1 h-3 w-3" />
                              <Trans>Admin</Trans>
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Trans>User</Trans>
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 text-right text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
