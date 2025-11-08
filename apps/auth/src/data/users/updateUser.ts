import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { User } from "../../models";
import { openPrisma } from "../../services";
import { getClient } from "../../helpers/prismaClient";
import { PrismaClient } from "../../../generated/client-core/client";

export const updateUser = (id: number, data: User) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
    const found = await client.usuarios.findUnique({
      where: { id },
    });
    if (!found)
      throw new PrismaClientValidationError("Usuario no encontrado", {
        clientVersion: "1",
      });
    const result = await client.usuarios.update({
      where: { id },
      data,
    });
    return {
      data: result,
      message: "Usuario actualizado correctamente",
    };
  });
