import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";
import { Report } from "../../schemas";

export const modifyReport = (
  data: Partial<Report> & { status?: boolean },
  reportId: number,
) =>
  openPrisma("Core", async (client: CoreClient) => {
    const found = await client.reportes.findUnique({
      where: { id: reportId },
    });
    if (!found) {
      throw new PrismaClientValidationError("Reporte no encontrado", {
        clientVersion: "1",
      });
    }
    const result = await client.reportes.update({
      where: { id: reportId },
      data: {
        appsId: data.app,
        categoryReportsId: data.category,
        endpoint: data.url,
        name: data.name,
        status: data.status,
      },
    });
    return {
      data: result,
      message: "Reporte modificado correctamente",
    };
  });
