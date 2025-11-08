import { openPrisma } from "../services";
import { getClient } from "../helpers/prismaClient";
import { PrismaClient } from "../../generated/client-core/client";

export const getTenants = (page: number, size: number, name: string) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
    const offset = page * size;
    const items = await client.tenant.findMany({
      take: size,
      skip: offset,
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
    const count = await client.tenant.count({
      select: {
        _all: true,
      },
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
    return {
      data: {
        count: count._all,
        next: items.length == size ? page + 1 : null,
        previous: page > 0 ? page - 1 : null,
        results: items,
      },
      message: "Tenants",
    };
  });

export const getAllTenants = () =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
    const items = await client.tenant.findMany();
    return {
      data: items,
      message: "Tenants",
    };
  });
