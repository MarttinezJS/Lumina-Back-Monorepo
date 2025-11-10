import {
  openPrisma,
  PrismaClientValidationError,
  Tenant,
} from "@lumina/prisma";

export const saveHeading = (data: Rubros, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const found = await client.rubros.findMany({
      where: {
        name: data.name,
        AND: {
          income: data.income,
        },
      },
    });

    if (found.length > 0) {
      throw new PrismaClientValidationError(
        "El rubro ya se encuentra registrado.",
        { clientVersion: "1" }
      );
    }

    return {
      data: await client.rubros.create({ data }),
      message: "Rubro registrado correctamente.",
    };
  });
