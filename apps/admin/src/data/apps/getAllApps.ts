import { openPrisma, CoreClient } from "@lumina/prisma";

export const getAllApps = () =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.apps.findMany();
    return {
      data: result,
      message:
        result.length > 0 ? "Apps registradas" : "No hay apps registradas",
    };
  });
