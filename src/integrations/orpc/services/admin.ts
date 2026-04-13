import { desc } from "drizzle-orm";

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

class AdminService {
  async listUsers({ currentUserId }: { currentUserId: string }): Promise<ListUsersResult> {
    // Get all users ordered by creation date (newest first)
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
}

export const adminService = new AdminService();
