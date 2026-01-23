import { openPrisma, CoreClient } from "@lumina/prisma";
import { ReportesWhereInput } from "@lumina/prisma/dist/generated/client-core/models";

export const getReports = (
  page: number,
  size: number,
  where: ReportesWhereInput,
) =>
  openPrisma("Core", async (client: CoreClient) => {
    const offset = page * size;
    const items = await client.reportes.findMany({
      take: size,
      skip: offset,
      include: {
        app: true,
        categoryReport: true,
        paramsReports: true,
      },
      omit: {
        appsId: true,
        categoryReportsId: true,
      },
      where,
    });
    const count = await client.reportes.count({
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
          ? "No se encontraron reportes"
          : "Listado de reportes descargables.",
    };
  });
