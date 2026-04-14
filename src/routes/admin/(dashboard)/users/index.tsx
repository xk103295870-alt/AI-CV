import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { UsersIcon, MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon, ShieldIcon, ProhibitIcon, UserIcon, KeyIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import type { RouterOutput } from "@/integrations/orpc/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { orpc } from "@/integrations/orpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminShell } from "@/routes/admin/-components/admin-shell";
import { requireAdmin } from "@/routes/admin/-utils/require-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/(dashboard)/users/")({
  beforeLoad: async ({ context }) => {
    requireAdmin(context.session);
  },
  component: AdminUsers,
});

type AdminUser = RouterOutput["admin"]["users"]["list"]["users"][number];

function normalize(value: string | null | undefined) {
  return value?.toLowerCase() ?? "";
}

function formatDate(input: Date | string | null | undefined) {
  if (!input) return "-";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("zh-CN");
}

function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const { data, isLoading, error } = useQuery(orpc.admin.users.list.queryOptions());

  const resetPasswordMutation = useMutation({
    ...orpc.admin.users.resetPassword.mutationOptions(),
    onSuccess: () => {
      toast.success("密码重置成功");
      setNewPassword("");
      setShowResetForm(false);
    },
    onError: (error) => {
      toast.error(`密码重置失败: ${error.message}`);
    },
  });

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers =
    data?.users.filter((user) => {
      if (!normalizedQuery) return true;

      return (
        normalize(user.name).includes(normalizedQuery) ||
        normalize(user.email).includes(normalizedQuery) ||
        normalize(user.username).includes(normalizedQuery)
      );
    }) ?? [];

  return (
    <AdminShell
      title="用户管理"
      description="管理系统所有注册用户"
      actions={
        <div className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">共 {data?.total ?? 0} 位用户</span>
        </div>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索用户名、邮箱或昵称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>用户列表</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-center text-sm text-destructive">
                加载用户失败，请重试。
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户信息</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                      <TableHead className="text-center">角色</TableHead>
                      <TableHead className="text-right">注册时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          未找到匹配的用户
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                <UserIcon className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">@{user.username}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{user.email}</span>
                              {user.emailVerified ? (
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircleIcon className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {user.banned ? (
                              <Badge variant="destructive">
                                <ProhibitIcon className="mr-1 h-3 w-3" />
                                已封禁
                              </Badge>
                            ) : (
                              <Badge variant="default" className="bg-green-500">
                                正常
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {user.role === "admin" ? (
                              <Badge variant="outline" className="border-primary text-primary">
                                <ShieldIcon className="mr-1 h-3 w-3" />
                                管理员
                              </Badge>
                            ) : (
                              <Badge variant="secondary">普通用户</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                              详情
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => {
        if (!open) {
          setSelectedUser(null);
          setShowResetForm(false);
          setNewPassword("");
        }
      }}>
        <DialogContent className="sm:max-w-lg" showClose>
          <DialogHeader>
            <DialogTitle>用户详情</DialogTitle>
            <DialogDescription>查看该用户的基础信息、权限和状态。</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">用户 ID</p>
                  <p className="break-all text-sm">{selectedUser.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">昵称</p>
                  <p className="text-sm font-medium">{selectedUser.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">用户名</p>
                  <p className="text-sm">@{selectedUser.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">邮箱</p>
                  <p className="break-all text-sm">{selectedUser.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">邮箱验证</p>
                  <Badge variant={selectedUser.emailVerified ? "default" : "secondary"}>
                    {selectedUser.emailVerified ? "已验证" : "未验证"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">账号状态</p>
                  <Badge variant={selectedUser.banned ? "destructive" : "default"}>
                    {selectedUser.banned ? "已封禁" : "正常"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">角色</p>
                  <Badge variant="outline">{selectedUser.role === "admin" ? "管理员" : "普通用户"}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">注册时间</p>
                  <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">最后活跃时间</p>
                  <p className="text-sm">{formatDate(selectedUser.lastActiveAt)}</p>
                </div>
              </div>

              {/* 密码重置区域 */}
              <div className="border-t pt-4">
                {!showResetForm ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowResetForm(true)}
                  >
                    <KeyIcon className="mr-2 h-4 w-4" />
                    重置密码
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Label htmlFor="new-password">新密码</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="请输入新密码（至少6位）"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        className="flex-1"
                        disabled={newPassword.length < 6 || resetPasswordMutation.isPending}
                        onClick={() => {
                          if (selectedUser) {
                            resetPasswordMutation.mutate({
                              userId: selectedUser.id,
                              newPassword,
                            });
                          }
                        }}
                      >
                        {resetPasswordMutation.isPending ? "重置中..." : "确认重置"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowResetForm(false);
                          setNewPassword("");
                        }}
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
