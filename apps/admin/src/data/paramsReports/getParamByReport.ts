import {
  openPrisma,
  CoreClient,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const getParamByReport = (reportId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const report = await client.reportes.findUnique({
      where: { id: reportId },
      include: { paramsReports: true },
    });
    if (!report) {
      throw new PrismaClientValidationError(
        "No se encontró el reporte especificado",
        { clientVersion: "1" },
      );
    }
    return {
      data: report.paramsReports,
      message:
        report.paramsReports.length > 0
          ? "Parámetros del reporte"
          : "No se encontraron parámetros para este reporte",
    };
  });
