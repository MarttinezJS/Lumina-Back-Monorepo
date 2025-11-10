import { openPrisma, Tenant } from "@lumina/prisma";

export const getEntries = (
  income = true,
  tenant: Tenant,
  dateSelected?: string
) =>
  openPrisma(tenant, async (client) => {
    const date = dateSelected ? new Date(dateSelected) : undefined;
    let result = [];
    const inicio = date
      ? new Date(date.getFullYear(), date.getMonth(), 1)
      : undefined;
    const fin = date
      ? new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
      : undefined;
    const params: any = {
      where: {
        date: {
          gte: inicio,
          lte: fin,
        },
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
      omit: {
        headingId: true,
      },
    };
    if (income) {
      result = await client.ingresos.findMany({
        ...params,
        orderBy: [{ date: "desc" }, { concept: "asc" }],
      });
    } else {
      result = await client.egresos.findMany({
        ...params,
        orderBy: [{ date: "desc" }, { supplier: "asc" }],
      });
    }
    return {
      data: result,
      message: "Consulta de registros.",
    };
  });
