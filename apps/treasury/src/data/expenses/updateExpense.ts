import {
  openPrisma,
  PrismaClientValidationError,
  Tenant,
} from "@lumina/prisma";
import { Egresos } from "../../models";

export const updateExpense = (id: number, data: Egresos, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const found = await client.egresos.findUnique({
      where: { id },
    });
    if (!found) {
      throw new PrismaClientValidationError("Egreso no encontrado", {
        clientVersion: "1",
      });
    }
    const result = await client.egresos.update({
      where: { id },
      data,
    });
    return {
      data: result,
      message: "Egreso actualizado correctamente",
    };
  });
