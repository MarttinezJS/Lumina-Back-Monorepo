import { PrismaClient, openPrisma, Tenant } from "@lumina/prisma";

export const createBudget = (
  data: { year: number; headingId: number; amount: number }[],
  tenant: Tenant
) =>
  openPrisma(tenant, async (client: PrismaClient) => {
    const result = data.map(async ({ amount, headingId, year }) => {
      const resp = await client.presupuestoRubros.upsert({
        create: {
          year,
          headingId,
          amount,
        },
        update: {
          amount,
        },
        where: {
          year_headingId: { year, headingId },
        },
      });
      return resp;
    });
    return {
      data: await Promise.all(result),
      message: "Presupuesto registrado correctamente",
    };
  });
