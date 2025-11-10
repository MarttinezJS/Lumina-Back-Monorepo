import {
  openPrisma,
  PrismaClientValidationError,
  Tenant,
} from "@lumina/prisma";

export const updateIdType = (
  id: number,
  data: Tipo_Identificacion,
  tenant: Tenant
) =>
  openPrisma(tenant, async (client) => {
    const found = await client.tipo_Identificacion.findUnique({
      where: { id },
    });
    if (!found)
      throw new PrismaClientValidationError(
        `El tipo de identificación con id ${id} no existe`,
        { clientVersion: "1" }
      );
    const result = await client.tipo_Identificacion.update({
      where: { id },
      data,
    });
    return {
      data: result,
      message: "Tipo de identificación actualizado correctamente.",
    };
  });
