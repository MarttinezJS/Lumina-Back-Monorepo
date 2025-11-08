import { CoreClient, openPrisma } from "@lumina/prisma";
import { TreeNode } from "../../models";

type Node = TreeNode & { ancestorId: number | null; position: number | null };
let maxId: number = 0;

export const getMenuTree = (userId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const menus = await client.menu.findMany({
      include: {
        Usuarios_Menu: {
          where: {
            usuario_id: userId,
          },
        },
      },
      where: {
        status: true,
      },
    });
    const agg = await client.menu.aggregate({
      _max: {
        id: true,
      },
    });
    maxId = agg._max.id ?? 0;
    const map = new Map<number, Node>();
    const roots: TreeNode[] = [];
    menus.sort((a, b) => (b.position ?? 0) - (a.position ?? 0));
    menus.forEach((m) =>
      map.set(m.id, {
        ...parseMenu(m),
        ancestorId: m.ancestorId,
        position: m.position,
      })
    );
    map.forEach(({ ancestorId, ...item }) => {
      if (ancestorId !== null) {
        const parent = map.get(ancestorId);
        if (parent) {
          parent.children?.push(item);
        }
      } else {
        roots.push(item);
      }
    });
    return {
      data: {
        name: "",
        id: 0,
        children: roots,
      },
      message: "Árbol de menus",
    };
  });
const parseMenu = ({
  title,
  id,
  ancestorId,
  description,
  endpoint,
  frontPath,
  Usuarios_Menu,
  status,
  ...permissions
}: Menu & { Usuarios_Menu: Usuarios_Menu[] }): TreeNode => {
  const permissionList = Object.entries(permissions)
    .filter((permission) => permission[1] === true)
    .map((permission) => {
      maxId += 1;
      const allowed =
        Usuarios_Menu[0]?.[permission[0] as keyof Usuarios_Menu] ?? false;
      const node: TreeNode = {
        name: permission[0],
        id: maxId,
        isBranch: false,
        metadata: {
          allowed,
        },
      };
      return node;
    });

  return {
    name: title,
    id: id,
    children: permissionList,
  };
};
