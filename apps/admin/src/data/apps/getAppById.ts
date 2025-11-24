import { openPrisma, CoreClient } from "@lumina/prisma";

export const getAppById = (appId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.apps.findUnique({ where: { id: appId } });
    return {
      data: result,
      message: "Aplicación encontrada.",
    };
  });
