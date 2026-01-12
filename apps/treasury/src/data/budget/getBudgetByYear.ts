import { PrismaClient, openPrisma, Tenant } from "@lumina/prisma";

export const getBudgetByYear = (year: number, tenant: Tenant) =>
  openPrisma(tenant, async (client: PrismaClient) => {
    const headings = await client.rubros.findMany({
      where: {
        income: false,
      },
    });
    const budget = await client.presupuestoRubros.findMany({
      where: {
        year,
      },
    });

    const result = headings.map((heading) => {
      const budgetForHeading = budget.find((b) => b.headingId == heading.id);

      return {
        heading: heading.name,
        monthly: budgetForHeading ? budgetForHeading.amount / 12 : 0,
        annual: budgetForHeading ? budgetForHeading.amount : 0,
      };
    });

    return {
      data: result,
      message: `Presupuesto del año ${year}`,
    };
  });
