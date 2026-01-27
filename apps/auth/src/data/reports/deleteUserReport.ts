import { openPrisma, CoreClient } from "@lumina/prisma";

export const deleteUserReport = (userId: number, reportId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.usuarios_Reportes.delete({
      where: {
        reportId_userId: {
          reportId,
          userId,
        },
      },
    });
    return {
      data: result,
      message: "Asignación eliminada correctamente",
    };
  });
