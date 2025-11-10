import { MenuSidebarItem, MenuSubItem } from "../../models";
import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const buildSidebar = (userId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const menus = await client.menu.findMany({
      include: {
        Usuarios_Menu: true,
      },
      where: {
        view: true,
        status: true,
        Usuarios_Menu: {
          some: { usuario_id: userId },
        },
      },
      orderBy: [
        {
          position: "desc",
        },
        {
          title: "asc",
        },
      ],
    });
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

// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (1, 'Administracíon', '/admin', '/', null, null, false, false, true, false, false, false, false, true, 0, 'MdLockPerson');
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (2, 'Menús', '/auth/menus', '/menus', null, 1, true, true, true, true, true, false, false, true, 0, null);
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (3, 'Cuentas', '/cuentas', '/', null, null, false, false, true, false, false, false, false, true, 1, 'MdOutlinePeopleOutline');
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (4, 'Usuarios', '/auth/users', '/users', null, 3, true, true, true, true, true, false, false, true, 0, null);
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (5, 'Mi perfil', '/auth/users/*', '/profile', null, 3, true, true, true, true, true, false, false, true, 0, null);
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (6, 'Usuarios Menus', '/auth/users/*/menus', '/users/*/menus', 'Arbol de permisos para los usuarios', 4, true, true, false, true, false, false, false, true, 0, null);
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (7, 'Parametros', '/params', '/', 'Parametros de la aplicacion', null, false, false, true, false, false, false, false, true, 2, 'MdOutlineSettings');
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (8, 'Rubros', '/treasury/heading', '/heading', 'Rubros de ingresos y egresos', 7, true, true, true, true, true, false, false, true, 0, null);
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (9, 'Proveedores', '/treasury/suppliers', '/suppliers', null, 7, true, true, true, true, true, false, false, true, 0, null);
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (10, 'Registros', '/registros', '/', null, null, false, false, true, false, false, false, false, true, 3, 'MdSell');
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (11, 'Ingresos', '/treasury/incomes', '/incomes', null, 10, true, true, true, true, true, false, false, true, 1, 'MdDataExploration');
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (12, 'Egresos', '/treasury/expenses', '/expenses', null, 10, true, true, true, true, true, false, false, true, 0, 'MdCurrencyExchange');
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (13, 'Tipos de identificacion', '/treasury/identification-types', '/identification-types', null, 7, true, true, true, true, true, false, false, true, 0, 'MdOutlinePersonPin');
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (14, 'Dashboard', '/dashboard', '/dashboard', '', null, false, false, true, false, false, false, false, true, 4, 'MdGridView');
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (15, 'Verificar registros', '/treasury/entry-issues', '/entry-issues', '', 10, true, true, true, true, true, false, false, true, 0, 'MdOutlineDry');
// INSERT INTO public."Menu" (id, titulo, endpoint, "frontPath", descripcion, menu_padre, leer, escribir, ver, editar, eliminar, imprimir, reporte, activo, posicion, icono) VALUES (16, 'Resolver incidencia', '/treasury/entry-issues/solve/*', '/solve-issue', '', 15, false, false, false, true, false, false, false, true, 0, 'MdAssignmentLate');
