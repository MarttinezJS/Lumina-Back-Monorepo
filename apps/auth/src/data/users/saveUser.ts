import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { User } from "../../models";
import { openPrisma } from "../../services";
import { getClient } from "../../helpers/prismaClient";
import { PrismaClient } from "../../../generated/client-core/client";

export const saveUser = (user: User) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
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
