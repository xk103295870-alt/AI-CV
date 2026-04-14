import { z } from "zod";
import { protectedProcedure } from "../context";
import { adminService } from "../services/admin";

export const adminRouter = {
  users: {
    list: protectedProcedure
      .route({
        method: "GET",
        path: "/admin/users",
        tags: ["Admin"],
        operationId: "listUsers",
        summary: "List all users",
        description: "Returns a list of all registered users with their basic information. Requires admin authentication.",
        successDescription: "A list of users with their details.",
      })
      .handler(async ({ context }) => {
        await adminService.assertAdmin(context.user.id);
        return await adminService.listUsers();
      }),

    resetPassword: protectedProcedure
      .route({
        method: "POST",
        path: "/admin/users/reset-password",
        tags: ["Admin"],
        operationId: "resetUserPassword",
        summary: "Reset user password",
        description: "Reset a user's password to a new value. Requires admin authentication.",
        successDescription: "Password has been reset successfully.",
      })
      .input(z.object({
        userId: z.string(),
        newPassword: z.string().min(6, "密码至少6位"),
      }))
      .handler(async ({ context, input }) => {
        await adminService.assertAdmin(context.user.id);
        await adminService.resetUserPassword(input.userId, input.newPassword);
        return { success: true, message: "密码重置成功" };
      }),
  },

  statistics: {
    overview: protectedProcedure
      .route({
        method: "GET",
        path: "/admin/statistics/overview",
        tags: ["Admin"],
        operationId: "getOverviewStats",
        summary: "Get overview statistics",
        description: "Returns overview statistics for the admin dashboard. Requires admin authentication.",
        successDescription: "Overview statistics data.",
      })
      .handler(async ({ context }) => {
        await adminService.assertAdmin(context.user.id);
        return await adminService.getOverviewStats();
      }),
  },
};
