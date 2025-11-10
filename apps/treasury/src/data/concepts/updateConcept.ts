import {
  openPrisma,
  PrismaClientValidationError,
  Tenant,
} from "@lumina/prisma";

export const updateConcept = (
  id: number,
  data: { name: string },
  tenant: Tenant
) =>
  openPrisma(tenant, async (client) => {
    const found = await client.conceptos.findUnique({ where: { id } });
    if (!found)
      throw new PrismaClientValidationError("Concepto no encontrado", {
        clientVersion: "1",
      });
    const result = await client.conceptos.update({
      where: { id },
      data,
    });
    return {
      data: result,
      message: "Concepto actualizado correctamente",
    };
  });
