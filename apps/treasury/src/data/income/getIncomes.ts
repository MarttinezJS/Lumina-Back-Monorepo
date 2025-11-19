import { openPrisma, Tenant } from "@lumina/prisma";

export const getIncomes = (
  page: number,
  size: number,
  where: any,
  tenant: Tenant
) =>
  openPrisma(tenant, async (client) => {
    const offset = page * size;
    const items = await client.ingresos.findMany({
      take: size,
      skip: offset,
      include: {
        heading: true,
        issues: {
          omit: { expenseId: true, incomeId: true },
          orderBy: [{ solved: "asc" }, { createdAt: "desc" }],
          where: {
            solved: false,
          },
        },
      },
      where,
      orderBy: [{ date: "desc" }, { concept: "asc" }],
      omit: {
        headingId: true,
      },
    });
    const count = await client.ingresos.count({
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
      message: "Listado de ingresos.",
    };
  });
