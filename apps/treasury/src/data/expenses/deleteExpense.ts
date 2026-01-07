import {
  PrismaClient,
  openPrisma,
  Tenant,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const deleteExpense = (id: number, tenant: Tenant) =>
  openPrisma(tenant, async (client: PrismaClient) => {
    const found = await client.egresos.findUnique({ where: { id } });
    if (!found) {
      throw new PrismaClientValidationError("Egreso no encontrado", {
        clientVersion: "1",
      });
    }
    const result = await client.egresos.delete({ where: { id } });
    return {
      data: result,
      message: "Egreso eliminado correctamente",
    };
  });
