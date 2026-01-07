import {
  PrismaClient,
  openPrisma,
  Tenant,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const deleteIncome = (id: number, tenant: Tenant) =>
  openPrisma(tenant, async (client: PrismaClient) => {
    const found = await client.ingresos.findUnique({ where: { id } });
    if (!found) {
      throw new PrismaClientValidationError("Ingreso no encontrado", {
        clientVersion: "1",
      });
    }
    const result = await client.ingresos.delete({ where: { id } });
    return {
      data: result,
      message: "Ingreso eliminado correctamente",
    };
  });
