import { openPrisma, Tenant } from "@lumina/prisma";

export const getIdType = (
  page: number,
  size: number,
  where: any,
  tenant: Tenant
) =>
  openPrisma(tenant, async (client) => {
    const offset = page * size;
    const items = await client.tipo_Identificacion.findMany({
      take: size,
      skip: offset,
      where,
    });
    const count = await client.tipo_Identificacion.count({
      select: {
        _all: true,
      },
      where,
    });
    return {
      data: {
        count: count._all,
        next:
          Math.trunc(((page + 1) * size) / count._all) < 1 ? page + 1 : null,
        previous: page > 0 ? page - 1 : null,
        results: items,
      },
      message: "",
    };
  });
