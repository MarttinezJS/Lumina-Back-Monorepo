import { openPrisma, CoreClient } from "@lumina/prisma";

export const getReportsByUser = (userId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    console.log(userId);

    const result = await client.usuarios_Reportes.findMany({
      where: {
        userId,
      },
      include: {
        report: true,
      },
    });
    return {
      data: result.map((r) => r.report),
      message:
        result.length > 0
          ? "Listado de reportes asignados al usuario"
          : "No se encontraron reportes asignados",
    };
  });
