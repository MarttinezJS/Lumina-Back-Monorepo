import {
  openPrisma,
  CoreClient,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const deleteParam = (paramId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const found = await client.parametros_Reportes.findUnique({
      where: { id: paramId },
    });
    if (!found) {
      throw new PrismaClientValidationError("Parámetro no encontrado", {
        clientVersion: "1",
      });
    }
    const result = await client.parametros_Reportes.delete({
      where: { id: paramId },
    });
    return {
      data: result,
      message: "Parámetro eliminado correctamente",
    };
  });
