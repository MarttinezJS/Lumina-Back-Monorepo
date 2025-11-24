import { openPrisma, CoreClient } from "@lumina/prisma";

export const removeUserApp = (
  appId: number,
  userId: number,
  tenantId: number
) =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.usuariosApps.deleteMany({
      where: {
        appId,
        tenantId,
        userId,
      },
    });
    return {
      data: result,
      message: "Asignación eliminada correctamente",
    };
  });
