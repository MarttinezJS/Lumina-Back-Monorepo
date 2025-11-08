import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { openPrisma } from "../../services";
import { getClient } from "../../helpers/prismaClient";
import { PrismaClient } from "../../../generated/client-core/client";

export const authorize = (userId: number, endpoint: string | undefined) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
    if (!endpoint) {
      throw new PrismaClientValidationError(
        "No se encontró ruta para validar.",
        { clientVersion: "1" }
      );
    }

    const menu = await client.menu.findUnique({
      where: {
        endpoint,
      },
    });
    if (!menu) {
      throw new PrismaClientValidationError("No se encontró el menú.", {
        clientVersion: "1",
      });
    }
    const { id, menu_id, usuario_id, ...userMenu } =
      (await client.usuarios_Menu.findUnique({
        where: {
          usuario_id_menu_id: {
            menu_id: menu.id,
            usuario_id: userId,
          },
        },
      })) as any;

    return {
      data: Object.keys(userMenu).reduce((acc: any, value) => {
        if (userMenu[value] == true) acc[value] = true;
        return acc;
      }, {}),
      message: "Permisos asociados",
    };
  });
