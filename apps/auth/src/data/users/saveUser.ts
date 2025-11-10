import { User } from "../../models";
import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const saveUser = (user: User) =>
  openPrisma("Core", async (client: CoreClient) => {
    const found = await client.usuarios.findUnique({
      where: {
        username: user.username,
        OR: [
          {
            email: user.email,
          },
        ],
      },
    });
    if (found) {
      throw new PrismaClientValidationError(
        "El usuario ya se encuentra registrado",
        { clientVersion: "1" }
      );
    }
    const { password, ...userSaved } = await client.usuarios.create({
      data: user,
    });
    return {
      data: userSaved,
      message: "Usuario registrado.",
    };
  });
