import { CoreClient, openPrisma } from "@lumina/prisma";

export const getTenants = (page: number, size: number, where?: object) =>
  openPrisma("Core", async (client: CoreClient) => {
    const offset = page * size;
    const items = await client.tenant.findMany({
      take: size,
      skip: offset,
      where,
    });
    const count = await client.tenant.count({
      select: {
        _all: true,
      },
      where,
    });
    return {
      data: {
        count: count._all,
        next: items.length == size ? page + 1 : null,
        previous: page > 0 ? page - 1 : null,
        results: items,
      },
      message: "Listado de tenants.",
    };
  });
