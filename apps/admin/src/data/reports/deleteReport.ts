import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const deleteReport = (reportId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const found = await client.reportes.findUnique({
      where: { id: reportId },
    });
    if (!found) {
      throw new PrismaClientValidationError("Reporte no encontrado.", {
        clientVersion: "1",
      });
    }
    const result = await client.reportes.delete({
      where: { id: reportId },
    });
    return {
      data: result,
      message: "Reporte eliminado correctamente.",
    };
  });
