import { openPrisma, Tenant } from "@lumina/prisma";

export const patchEntry = (
  income: boolean,
  id: number,
  verified: boolean,
  tenant: Tenant
) =>
  openPrisma(tenant, async (client) => {
    let result;
    const params: any = {
      where: {
        id,
      },
      data: {
        verified,
      },
      include: {
        heading: true,
        issues: {
          orderBy: [{ solved: "asc" }, { createdAt: "desc" }],
          omit: {
            expenseId: true,
            incomeId: true,
          },
        },
      },
    };
    if (income) {
      result = await client.ingresos.update(params);
    } else {
      result = await client.egresos.update(params);
    }
    return {
      data: result,
      message: "El estado verificado se ha cambiado correctamente",
    };
  });
