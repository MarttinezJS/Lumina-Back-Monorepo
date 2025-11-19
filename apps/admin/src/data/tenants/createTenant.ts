import { CoreClient, openPrisma } from "@lumina/prisma";

export const createTenant = (name: string) =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.tenant.create({
      data: {
        name,
      },
    });
    return {
      data: result,
      message: "Listado de apps.",
    };
  });
