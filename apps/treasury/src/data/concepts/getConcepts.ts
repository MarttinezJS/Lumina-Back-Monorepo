import { openPrisma, Tenant } from "@lumina/prisma";

export const getConcepts = (
  page: number,
  size: number,
  tenant: Tenant,
  where?: any
) =>
  openPrisma(tenant, async (client) => {
    const offset = page * size;
    const items = await client.conceptos.findMany({
      take: size,
      skip: offset,
      where,
    });
    const count = await client.conceptos.count({
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
      message: "Consulta de conceptos.",
    };
  });
