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
