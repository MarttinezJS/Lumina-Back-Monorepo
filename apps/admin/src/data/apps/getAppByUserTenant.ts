import { openPrisma, CoreClient } from "@lumina/prisma";

export const getAppByUserTenant = (userId: number, tenantId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.apps.findMany({
      where: {
        UsuariosApps: {
          some: {
            userId: userId,
            tenantId: tenantId,
          },
        },
      },
    });
    return {
      data: result,
      message:
        result.length > 0
          ? "Aplicaciones asignadas."
          : "No hay aplicaciones asignadas.",
    };
  });
