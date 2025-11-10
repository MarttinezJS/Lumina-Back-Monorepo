import { openPrisma, Tenant } from "@lumina/prisma";

export const getHeadings = (
  page: number,
  size: number,
  tenant: Tenant,
  where?: any
) =>
  openPrisma(tenant, async (client) => {
    const offset = page * size;
    const headings = await client.rubros.findMany({
      take: size,
      skip: offset,
      where,
    });

    const count = await client.rubros.count({
      select: {
        _all: true,
      },
      where,
    });
    return {
      data: {
        count: count._all,
        next: headings.length == size ? page + 1 : null,
        previous: page > 0 ? page - 1 : null,
        results: headings ?? [],
      },
      message: "Consulta de rubros",
    };
  });
