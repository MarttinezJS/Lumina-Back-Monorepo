import {
  openPrisma,
  PrismaClientValidationError,
  Tenant,
} from "@lumina/prisma";

export const createIdType = (data: Tipo_Identificacion, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const found = await client.tipo_Identificacion.findUnique({
      where: {
        abb: data.abb,
      },
    });
    if (found) {
      throw new PrismaClientValidationError(
        "Ya existe un tipo de identificación con esa abreviatura.",
        { clientVersion: "1" }
      );
    }
    const resp = await client.tipo_Identificacion.create({ data });
    return {
      data: resp,
      message: "Tipo de identificación Guardado correctamente",
    };
  });
