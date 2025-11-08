import { CoreClient, openPrisma } from "@lumina/prisma";

export const getAll = (page: number, size: number) =>
  openPrisma("Core", async (client: CoreClient) => {
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
