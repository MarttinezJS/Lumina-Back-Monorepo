import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { openPrisma } from "../../services";
import { getClient } from "../../helpers/prismaClient";
import { PrismaClient } from "../../../generated/client-core/client";

export const updateMenu = (id: number, { endpoint, ...data }: Menu) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
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
