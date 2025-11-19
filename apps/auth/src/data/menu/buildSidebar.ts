import { MenuSidebarItem, MenuSubItem } from "../../models";
import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const buildSidebar = (
  userId: number,
  appName: string,
  tenantName: string
) =>
  openPrisma("Core", async (client: CoreClient) => {
    const tenant = await client.tenant.findUnique({
      where: { name: tenantName },
    });
    if (!tenant) {
      throw new PrismaClientValidationError(
        `El tenant ${tenantName} no existe.`,
        { clientVersion: "1" }
      );
    }
    const app = await client.apps.findUnique({ where: { url: appName } });
    if (!app) {
      throw new PrismaClientValidationError(`La app ${appName} no existe.`, {
        clientVersion: "1",
      });
    }

    const userMenus = await client.permisos.findMany({
      include: {
        Menu: true,
      },
      omit: { usuarioId: true, tenantId: true, menuId: true },
      where: {
        usuarioId: userId,
        tenantId: tenant.id,
        view: true,
        Menu: { appId: app.id, view: true },
      },
      orderBy: [{ Menu: { position: "desc" } }, { Menu: { title: "asc" } }],
    });
    const menus = userMenus.map(({ Menu, ...permissions }) => ({
      ...Menu,
      permissions,
    }));
    if (menus.length == 0) {
      throw new PrismaClientValidationError(
        "El usuario no tiene menus asignados.",
        { clientVersion: "1" }
      );
    }
    const { 0: mains, ...children } = menus.reduce((acc: any, item) => {
      const key = (item.ancestorId ?? "0") as keyof Menu;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
    if (!mains)
      throw new PrismaClientValidationError(
        "No se encontraron menus asociados",
        { clientVersion: "1" }
      );

    const sidebarItems = (mains as Menu[]).map<MenuSidebarItem>(
      ({ icon, title: name, id, frontPath }) => {
        const subItems = (children[id] as Menu[])?.map<MenuSubItem>(
          ({ title: name, frontPath: path }) => ({ name, path })
        );
        return {
          icon,
          name,
          subItems,
          path: !subItems ? frontPath : null,
        };
      }
    );

    return {
      data: sidebarItems,
      message: "Listado de elementos del sidebar.",
    };
  });
