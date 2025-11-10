import { openPrisma, Tenant } from "@lumina/prisma";

export const saveTransactionalIncome = (data: Ingresos[], tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const result = await client.ingresos.createMany({ data });
    return {
      data: result,
      message: "Ingresos guardados correctamente",
    };
  });
