import { User } from "../../models";
import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const updateUser = (id: number, data: User) =>
  openPrisma("Core", async (client: CoreClient) => {
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
