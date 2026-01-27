import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
  Tenant,
} from "@lumina/prisma";
import { ParamReport } from "../../schemas";

export const createParams = (data: ParamReport) =>
  openPrisma("Core", async (client: CoreClient) => {
    const report = await client.reportes.findUnique({
      where: { id: data.report },
    });
    if (!report) {
      throw new PrismaClientValidationError("Reporte no encontrado", {
        clientVersion: "1",
      });
    }
    const result = await client.parametros_Reportes.create({
      data: {
        field: data.field,
        name: data.name,
        queryUrl: data.queryUrl,
        reportsId: data.report,
        type: data.type,
        variant: data.variant,
      },
    });
    return {
      data: result,
      message: "Parámetro registrado correctamente",
    };
  });
