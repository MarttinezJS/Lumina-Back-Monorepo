import { openPrisma, CoreClient } from "@lumina/prisma";

export const getTenantsByUser = (userId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.usuariosTenant.findMany({
      where: { userId },
      include: { tenant: true },
    });
    return {
      data: result.map((r) => r.tenant),
      message:
        result.length > 0 ? "Listado de tenants" : "No se encontraron tenants",
    };
  });
