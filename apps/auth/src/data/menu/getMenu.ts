import { PrismaClient } from "../../../generated/client-core/client";
import { getClient } from "../../helpers/prismaClient";
import { openPrisma } from "../../services";

export const getMenu = (page: number, size: number, where?: any) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
    const offset = page * size;
    const results = await client.menu.findMany({
      take: size,
      skip: offset,
      omit: {
        ancestorId: true,
      },
      include: { ancestor: true },
      orderBy: {
        id: "desc",
      },
      where,
    });

    const count = await client.menu.count({
      select: { _all: true },
      where,
    });
    return {
      message: "Consulta de menus",
      data: {
        count: count._all,
        next: results.length == size ? page + 1 : null,
        previous: page > 0 ? page - 1 : null,
        results,
      },
    };
  });
