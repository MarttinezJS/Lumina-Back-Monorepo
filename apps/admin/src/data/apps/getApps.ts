import { CoreClient, openPrisma } from "@lumina/prisma";

export const getApps = (where: any) =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.apps.findMany(where);
    return {
      data: result,
      message: "Listado de apps.",
    };
  });
