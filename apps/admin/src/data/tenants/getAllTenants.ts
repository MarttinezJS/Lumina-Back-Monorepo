import { PrismaClient, openPrisma, Tenant, CoreClient } from "@lumina/prisma";

export const getAllTenants = () =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.tenant.findMany();
    return {
      data: result,
      message:
        result.length > 0
          ? "Listado de tenants"
          : "No se encontraron tenants registrados",
    };
  });
