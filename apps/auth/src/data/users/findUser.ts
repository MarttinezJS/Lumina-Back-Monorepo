import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { openPrisma } from "../../services";
import { getClient } from "../../helpers/prismaClient";
import { PrismaClient } from "../../../generated/client-core/client";

export const findByUsername = (username: string) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => ({
    data: await client.usuarios.findUnique({
      omit: {
        password: false,
      },
      where: { username },
    }),
    message: "Usuario encontrado.",
  }));

export const findUserById = (id: number) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
    const data = await client.usuarios.findUnique({
      where: { id },
      omit: {
        password: true,
      },
    });
    if (!data) {
      throw new PrismaClientKnownRequestError("Usuario no encontrado", {
        clientVersion: "1",
        code: "404",
      });
    }
    const completeName = `${data.firstName} ${data.lastName}`;
    Object.assign(data, completeName);
    return {
      data,
      message: "Usuario encontrado",
    };
  });
