import { openPrisma, CoreClient } from "@lumina/prisma";

export const deleteUserTenant = (tenantId: number, userId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.usuariosTenant.delete({
      where: {
        userId_tenantId: {
          tenantId,
          userId,
        },
      },
    });
    return {
      data: result,
      message: "Tenant desasociado correctamente",
    };
  });
