import { CoreClient, openPrisma } from "@lumina/prisma";
import { UserMenuRequest } from "../../schemas";

export const assignPermissions = (userMenu: UserMenuRequest) =>
  openPrisma("Core", async (client: CoreClient) => {
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
