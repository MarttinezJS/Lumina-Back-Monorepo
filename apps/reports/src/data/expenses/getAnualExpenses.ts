import { PrismaClient, openPrisma, Tenant } from "@lumina/prisma";
import { getMonthName } from "@lumina/utils";

export const getAnnualExpenses = (year: number, tenant: Tenant) =>
  openPrisma(tenant, async (client: PrismaClient) => {
    const budget = await client.presupuestoRubros.findMany({
      where: { year },
      include: { heading: true },
      omit: { headingId: true },
    });
    const monthlyExpenses = (await client.$queryRaw`
    WITH meses AS (
        SELECT generate_series(1, 12) AS mes
    ),
    rubros AS (
        SELECT id, nombre
        FROM public."Rubros"
        WHERE income = false
    ),
    egresos_mensuales AS (
        SELECT
            e.rubro_id,
            EXTRACT(MONTH FROM e.fecha) AS mes,
            SUM(e.cantidad) AS total
        FROM "Egresos" e
        WHERE EXTRACT(YEAR FROM e.fecha) = ${year}
        GROUP BY e.rubro_id, mes
    )
    SELECT
        r.nombre AS rubro,
        m.mes,
    COALESCE(em.total, 0) AS total,
    SUM(COALESCE(em.total, 0)) OVER (
        PARTITION BY r.nombre
        ORDER BY m.mes
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS acumulado
    FROM rubros r
    CROSS JOIN meses m
    LEFT JOIN egresos_mensuales em
    ON em.rubro_id = r.id
    AND em.mes = m.mes
    ORDER BY
    m.mes,
    r.nombre;

    `) as { rubro: string; mes: number; total: string; acumulado: number }[];

    const grouped = monthlyExpenses.reduce((acc: any, curr: any) => {
      const { rubro, mes, total, acumulado } = curr;
      const month = getMonthName(mes);
      const budgeted = budget.find((b) => b.heading.name == rubro)?.amount ?? 0;

      if (!acc[rubro]) {
        acc[rubro] = {};
      }
      if (!acc.total) {
        acc.total = { total: 0, budgeted: 0 };
      }
      acc[rubro][month] = Number(total);
      acc[rubro].total = Number(acumulado);

      acc.total[month] = (acc.total[month] || 0) + Number(total);
      acc.total.total += Number(total);

      acc[rubro].budgeted = budgeted;

      return acc;
    }, {});
    const { total, ...rest } = grouped;
    return {
      data: {
        ...rest,
        total: {
          ...total,
          budgeted: Object.keys(rest).reduce((acc, curr) => {
            acc += rest[curr].budgeted;
            return acc;
          }, 0),
        },
      },
      message: "Presupuesto y gastos",
    };
  });
