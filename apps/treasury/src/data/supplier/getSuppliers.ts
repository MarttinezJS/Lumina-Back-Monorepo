import { openPrisma, Tenant } from "@lumina/prisma";

export const getSuppliers = (
  page: number,
  size: number,
  where: any,
  tenant: Tenant
) =>
  openPrisma(tenant, async (client) => {
    const offset = page * size;
    const users = await client.proveedores.findMany({
      take: size,
      skip: offset,
      where,
    });
    const count = await client.proveedores.count({
      select: {
        _all: true,
      },
      where,
    });
    return {
      data: {
        count: count._all,
        next: users.length == size ? page + 1 : null,
        previous: page > 0 ? page - 1 : null,
        results: users,
      },
      message: "Consulta de proveedores.",
    };
  });
