import { CoreClient, openPrisma } from "@lumina/prisma";
import { TreeNode } from "../../models";

type Node = TreeNode & { ancestorId: number | null; position: number | null };
let maxId: number = 0;

export const getMenuTree = (userId: number, appId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const menus = await client.menu.findMany({
      include: {
        permission: {
          where: {
            usuarioId: userId,
          },
        },
      },
      where: {
        status: true,
        appId: appId,
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
      data:
        roots.length == 0
          ? null
          : {
              name: "",
              id: 0,
              children: roots,
            },
      message: roots.length == 0 ? "No se encontraron menus" : "Árbol de menus",
    };
  });
const parseMenu = ({
  id,
  title,
  endpoint,
  frontPath,
  description,
  ancestorId,
  permission,
  status,
  appId,
  ...permissionRequest
}: Menu & { permission: Permission[] }): TreeNode => {
  const permissionList = Object.entries(permissionRequest)
    .filter((permission) => permission[1] === true)
    .map((permissionNeeded) => {
      maxId += 1;
      const key = permissionNeeded[0] as keyof Permission;
      const allowed = permission[0]?.[key];

      const node: TreeNode = {
        name: key,
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
