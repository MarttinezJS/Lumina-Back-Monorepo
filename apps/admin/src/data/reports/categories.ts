import {
  openPrisma,
  CoreClient,
  PrismaClientValidationError,
} from "@lumina/prisma";
import { Categorias_ReportesWhereInput } from "@lumina/prisma/dist/generated/client-core/models";

export const createCategory = (name: string) =>
  openPrisma("Core", async (client: CoreClient) => {
    const found = await client.categorias_Reportes.findFirst({
      where: { name },
    });
    if (found) {
      throw new PrismaClientValidationError(
        "la categoría ya se encuentra registrada",
        { clientVersion: "1" },
      );
    }
    const result = await client.categorias_Reportes.create({ data: { name } });
    return {
      data: result,
      message: "Categoría creada correctamente",
    };
  });

export const getPaginatedCategories = (
  page: number,
  size: number,
  where: Categorias_ReportesWhereInput,
) =>
  openPrisma("Core", async (client: CoreClient) => {
    const offset = page * size;
    const items = await client.categorias_Reportes.findMany({
      take: size,
      skip: offset,
      where,
    });
    const count = await client.categorias_Reportes.count({
      select: {
        _all: true,
      },
      where,
    });
    return {
      data: {
        count: count._all,
        next: items.length == size ? page + 1 : null,
        previous: page > 0 ? page - 1 : null,
        results: items,
      },
      message:
        items.length == 0
          ? "No se encontraron categorías"
          : "Categorías de reportes",
    };
  });

export const getAllCategories = () =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.categorias_Reportes.findMany();
    return {
      data: result,
      message: "Categorías de reportes",
    };
  });
