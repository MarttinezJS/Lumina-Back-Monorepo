import { openPrisma, CoreClient } from "@lumina/prisma";

export const geAllReports = () =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.reportes.findMany({
      include: {
        app: true,
        categoryReport: true,
      },
      omit: {
        appsId: true,
        categoryReportsId: true,
      },
    });
    return {
      data: result,
      message:
        result.length > 0
          ? "Listado de reportes"
          : "No se encontraron reportes registrados",
    };
  });
