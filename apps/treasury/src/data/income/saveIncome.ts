import { openPrisma, Tenant } from "@lumina/prisma";

export const saveIncome = (data: Ingresos, tenant: Tenant) =>
  openPrisma(tenant, async (client) => ({
    data: await client.ingresos.create({ data }),
    message: "Ingreso guardado correctamente",
  }));
