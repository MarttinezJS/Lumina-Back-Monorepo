import { CoreClient, openPrisma } from "@lumina/prisma";

export const getApps = (page: number, size: number, where: any) =>
  openPrisma("Core", async (client: CoreClient) => {
    const offset = page * size;
    const items = await client.apps.findMany({
      take: size,
      skip: offset,
    });
    const count = await client.apps.count({
      select: {
        _all: true,
      },
    });
    return {
      data: {
        count: count._all,
        next: items.length == size ? page + 1 : null,
        previous: page > 0 ? page - 1 : null,
        results: items,
      },
      message: "Listado de apps.",
    };
  });
