import { PrismaClient } from "../../../generated/client-core/client";
import { getClient } from "../../helpers/prismaClient";
import { openPrisma } from "../../services";

export const getAll = (page: number, size: number) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
    const offset = page * size;
    const users = await client.usuarios.findMany({
      take: size,
      skip: offset,
      omit: {
        password: true,
      },
    });

    const count = await client.usuarios.count({
      select: {
        _all: true,
      },
    });
    return {
      data: {
        count: count._all,
        next: users.length == size ? page + 1 : null,
        previous: page > 0 ? page - 1 : null,
        results: users,
      },
      message: "Consulta de usuarios",
    };
  });
