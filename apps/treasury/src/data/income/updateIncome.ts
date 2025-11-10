import {
  openPrisma,
  PrismaClientValidationError,
  Tenant,
} from "@lumina/prisma";

export const updateIncome = (id: number, data: Ingresos, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const found = await client.ingresos.findUnique({
      where: { id },
    });
    if (!found)
      throw new PrismaClientValidationError("Ingreso no encontrado", {
        clientVersion: "1",
      });
    const result = await client.ingresos.update({
      where: { id },
      data,
    });
    return {
      data: result,
      message: "Ingreso actualizado correctamente.",
    };
  });
