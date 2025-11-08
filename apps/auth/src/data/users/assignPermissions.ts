import { PrismaClient } from "../../../generated/client-core/client";
import { getClient } from "../../helpers/prismaClient";
import { UserMenuRequest } from "../../schemas";
import { openPrisma } from "../../services";

export const assignPermissions = (userMenu: UserMenuRequest) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
    await client.usuarios_Menu.deleteMany({
      where: {
        usuario_id: userMenu.userId,
      },
    });

    const data = userMenu.permissions.map(({ menuId, ...permissions }) => ({
      menu_id: menuId,
      usuario_id: userMenu.userId,
      ...permissions,
    }));

    const inserted = await client.usuarios_Menu.createMany({
      data,
    });

    return {
      data: inserted,
      message: "Permisos asignados correctamente",
    };
  });
