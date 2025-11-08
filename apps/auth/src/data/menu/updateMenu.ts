import { CoreClient, openPrisma } from "@lumina/prisma";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

export const updateMenu = (id: number, { endpoint, ...data }: Menu) =>
  openPrisma("Core", async (client: CoreClient) => {
    const found = await client.menu.findUnique({
      where: { id },
    });

    if (!found)
      throw new PrismaClientValidationError("No se encontró el menú", {
        clientVersion: "1",
      });

    const result = await client.menu.update({
      data,
      where: { id },
    });

    return {
      data: result,
      message: "Menú actualizado correctamente",
    };
  });
