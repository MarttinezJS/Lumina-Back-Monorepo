import { CoreClient, openPrisma } from "@lumina/prisma";

export const getTenants = (
  username: string,
  page: number,
  size: number,
  name: string
) =>
  openPrisma("Core", async (client: CoreClient) => {
    const offset = page * size;
    const items = await client.usuariosTenant.findMany({
      where: {
        user: { username },
        tenant: {
          name: {
            contains: name,
          },
        },
      },
      omit: {
        tenantId: true,
        userId: true,
      },
      include: {
        tenant: true,
        user: true,
      },
      take: size,
      skip: offset,
    });
    const count = await client.usuariosTenant.count({
      where: {
        user: { username },
        tenant: {
          name: {
            contains: name,
          },
        },
      },
      select: {
        _all: true,
      },
    });
    return {
      data: {
        count: count._all,
        next:
          Math.trunc(((page + 1) * size) / count._all) < 1 ? page + 1 : null,
        previous: page > 0 ? page - 1 : null,
        results: items.map(({ tenant }) => tenant),
      },
      message:
        items.length == 0 ? "No se encontraron tenants asignados" : "Tenants",
    };
  });
export const getAllTenants = () =>
  openPrisma("Core", async (client: CoreClient) => {
    const items = await client.tenant.findMany();
    return {
      data: items,
      message: "Tenants",
    };
  });
