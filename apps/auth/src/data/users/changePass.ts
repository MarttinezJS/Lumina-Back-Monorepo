import { PrismaClient } from "../../../generated/client-core/client";
import { getClient } from "../../helpers/prismaClient";
import { openPrisma } from "../../services";

export const changePass = (id: number, password: string) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
    const result = await client.usuarios.update({
      where: {
        id,
      },
      data: {
        password,
        changePassword: false,
      },
    });
    return {
      data: null,
      message: "Contraseña cambiada correctamente.",
    };
  });
