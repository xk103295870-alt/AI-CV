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
        description: "Returns a list of all registered users with their basic information. Requires authentication.",
        successDescription: "A list of users with their details.",
      })
      .handler(async ({ context }) => {
        return await adminService.listUsers({ currentUserId: context.user.id });
      }),
  },
};
