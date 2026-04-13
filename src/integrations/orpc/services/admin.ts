import { desc, sql, and, gte } from "drizzle-orm";

import { db } from "../../drizzle/client";
import { schema } from "../../drizzle/schema";

export type UserListItem = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  username: string;
  role: string | null;
  banned: boolean | null;
  createdAt: Date;
  lastActiveAt: Date | null;
};

export type ListUsersResult = {
  users: UserListItem[];
  total: number;
};

export type OverviewStats = {
  totalResumes: number;
  todayActive: number;
  weeklyNewUsers: number;
};

class AdminService {
  async listUsers(): Promise<ListUsersResult> {
    const users = await db
      .select({
        id: schema.user.id,
        name: schema.user.name,
        email: schema.user.email,
        emailVerified: schema.user.emailVerified,
        username: schema.user.username,
        role: schema.user.role,
        banned: schema.user.banned,
        createdAt: schema.user.createdAt,
        lastActiveAt: schema.user.lastActiveAt,
      })
      .from(schema.user)
      .orderBy(desc(schema.user.createdAt));

    return {
      users,
      total: users.length,
    };
  }

  async getOverviewStats(): Promise<OverviewStats> {
    // 获取简历总数
    const [resumeResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.resume);

    // 获取今日活跃用户（假设有 lastActiveAt 字段）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [todayActiveResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.user)
      .where(gte(schema.user.lastActiveAt, today));

    // 获取本周新增用户
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const [weeklyNewResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.user)
      .where(gte(schema.user.createdAt, weekAgo));

    return {
      totalResumes: Number(resumeResult?.count ?? 0),
      todayActive: Number(todayActiveResult?.count ?? 0),
      weeklyNewUsers: Number(weeklyNewResult?.count ?? 0),
    };
  }
}

export const adminService = new AdminService();
