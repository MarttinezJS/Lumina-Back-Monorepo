import { openPrisma, CoreClient } from "@lumina/prisma";

export const usersByApps = (
  appId: number,
  tenantId: number,
  userQuery?: string,
  onlyIncluded: boolean = true
) =>
  openPrisma("Core", async (client: CoreClient) => {
    let results = [];
    if (onlyIncluded) {
      results = (
        await client.usuariosApps.findMany({
          include: { user: true },
          omit: { appId: true, tenantId: true, userId: true },
          where: {
            AND: [{ appId }, { tenantId }],
            OR: [
              {
                user: {
                  firstName: { contains: userQuery ?? "", mode: "insensitive" },
                },
              },
              {
                user: {
                  lastName: { contains: userQuery ?? "", mode: "insensitive" },
                },
              },
            ],
          },
          orderBy: [
            {
              user: { firstName: "asc" },
            },
            {
              user: { lastName: "asc" },
            },
          ],
        })
      ).map(({ assignedAt, user }) => ({
        ...user,
        assignedAt,
      }));
    } else {
      results = await client.usuarios.findMany({
        where: {
          NOT: {
            UsuariosApps: {
              some: {
                appId,
                tenantId,
              },
            },
          },
          AND: [
            {
              OR: [
                {
                  firstName: { contains: userQuery ?? "" },
                },
                {
                  lastName: { contains: userQuery ?? "" },
                },
              ],
            },
          ],
        },
        orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      });
    }
    return {
      data: results,
      message: "Usuarios de la aplicación.",
    };
  });
