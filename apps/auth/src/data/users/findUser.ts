import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { CoreClient, openPrisma } from "@lumina/prisma";

export const findByUsername = (username: string) =>
  openPrisma("Core", async (client: CoreClient) => ({
    data: await client.usuarios.findUnique({
      omit: {
        password: false,
      },
      where: { username },
    }),
    message: "Usuario encontrado.",
  }));

export const findUserById = (id: number) =>
  openPrisma("Core", async (client: CoreClient) => {
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
