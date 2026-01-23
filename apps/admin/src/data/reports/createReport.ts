import {
  openPrisma,
  CoreClient,
  PrismaClientValidationError,
} from "@lumina/prisma";
import { Report } from "../../schemas";

export const createReport = ({ app, category, name, url }: Report) =>
  openPrisma("Core", async (client: CoreClient) => {
    const found = await client.reportes.findFirst({
      where: {
        name,
      },
    });
    if (found) {
      throw new PrismaClientValidationError(
        "Ya existe un reporte con ese nombre",
        { clientVersion: "1" },
      );
    }
    const data = await client.reportes.create({
      data: {
        name,
        endpoint: url,
        appsId: app,
        categoryReportsId: category,
      },
    });
    return {
      data,
      message: "Reporte creado correctamente.",
    };
  });
