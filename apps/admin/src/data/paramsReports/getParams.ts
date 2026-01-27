import { PrismaClient, openPrisma, Tenant, CoreClient } from "@lumina/prisma";
import { Parametros_ReportesWhereInput } from "@lumina/prisma/dist/generated/client-core/models";

export const getParams = (
  page: number,
  size: number,
  where: Parametros_ReportesWhereInput,
) =>
  openPrisma("Core", async (client: CoreClient) => {
    const offset = page * size;
    const items = await client.parametros_Reportes.findMany({
      take: size,
      skip: offset,
      where,
    });
    const count = await client.parametros_Reportes.count({
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
      message:
        items.length == 0
          ? "No se encontraron parámetros"
          : "Listado de parámetros.",
    };
  });
