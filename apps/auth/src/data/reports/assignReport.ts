import { openPrisma, CoreClient } from "@lumina/prisma";

export const assignReport = (userId: number, reportId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.usuarios_Reportes.create({
      data: {
        reportId,
        userId,
      },
    });
    return {
      data: result,
      message: "Reporte asignado correctamente",
    };
  });
