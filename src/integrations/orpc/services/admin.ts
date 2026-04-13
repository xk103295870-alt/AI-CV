import { desc, sql, gte } from "drizzle-orm";

import { db } from "../../drizzle/client";
import { schema } from "../../drizzle/schema";
import { generateId } from "@/utils/string";

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

// 虚拟用户数据
const dummyUsers = [
  { name: "张三", email: "zhangsan@example.com", username: "zhangsan" },
  { name: "李四", email: "lisi@example.com", username: "lisi" },
  { name: "王五", email: "wangwu@example.com", username: "wangwu" },
  { name: "赵六", email: "zhaoliu@example.com", username: "zhaoliu" },
  { name: "陈七", email: "chenqi@example.com", username: "chenqi" },
  { name: "刘八", email: "liuba@example.com", username: "liuba" },
  { name: "周九", email: "zhoujiu@example.com", username: "zhoujiu" },
  { name: "吴十", email: "wushi@example.com", username: "wushi" },
  { name: "郑十一", email: "zhengshiyi@example.com", username: "zhengshiyi" },
  { name: "孙十二", email: "sunshier@example.com", username: "sunshier" },
];

class AdminService {
  async listUsers(): Promise<ListUsersResult> {
    // 检查是否有用户，如果没有则创建虚拟用户
    const existingUsers = await db.select({ count: sql<number>`count(*)` }).from(schema.user);
    
    if (existingUsers[0]?.count <= 1) {
      // 只有管理员用户，创建虚拟用户
      await this.createDummyUsers();
    }

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

  private async createDummyUsers() {
    const now = new Date();
    
    for (let i = 0; i < dummyUsers.length; i++) {
      const dummy = dummyUsers[i];
      const createdAt = new Date(now);
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30)); // 最近30天内随机
      
      try {
        await db.insert(schema.user).values({
          id: generateId(),
          name: dummy.name,
          email: dummy.email,
          emailVerified: Math.random() > 0.3, // 70%已验证
          username: dummy.username,
          displayUsername: dummy.username,
          role: "user",
          banned: Math.random() > 0.9, // 10%被封禁
          createdAt: createdAt,
          updatedAt: createdAt,
        });
      } catch (error) {
        // 忽略重复错误
        console.log(`User ${dummy.email} may already exist`);
      }
    }

    // 创建一些虚拟简历
    const users = await db.select({ id: schema.user.id }).from(schema.user).where(sql`${schema.user.role} = 'user'`);
    
    for (const user of users.slice(0, 5)) {
      try {
        await db.insert(schema.resume).values({
          id: generateId(),
          userId: user.id,
          name: `${dummyUsers[Math.floor(Math.random() * dummyUsers.length)].name}的简历`,
          slug: `resume-${generateId().slice(0, 8)}`,
          data: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (error) {
        // 忽略错误
      }
    }
  }

  async getOverviewStats(): Promise<OverviewStats> {
    // 获取简历总数
    const [resumeResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.resume);

    // 获取今日活跃用户
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
