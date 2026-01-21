import { PrismaClient, openPrisma, Tenant } from "@lumina/prisma";
import { getMonthName } from "@lumina/utils";

export const getAnnualIncomes = (year: number, tenant: Tenant) =>
  openPrisma(tenant, async (client: PrismaClient) => {
    const incomesByHeading = (await client.$queryRaw`
        WITH meses AS (
            SELECT generate_series(1, 12) AS mes
        ),
        ingresos_por_mes AS (
            SELECT
                r.nombre AS rubro,
                EXTRACT(MONTH FROM i.fecha)::int AS mes,
                SUM(i.cantidad) AS total
            FROM public."Ingresos" i
            JOIN public."Rubros" r ON i.rubro_id = r.id
            WHERE EXTRACT(YEAR FROM i.fecha) = ${year}
            GROUP BY r.nombre, mes
        )
        SELECT
            r.rubro,
            m.mes,
            COALESCE(rpm.total, 0) AS total_mes,
            SUM(COALESCE(rpm.total, 0)) OVER (PARTITION BY r.rubro) AS total_anual
        FROM meses m
        CROSS JOIN (
            SELECT nombre AS rubro
            FROM public."Rubros"
            WHERE income = true
        ) r
        LEFT JOIN ingresos_por_mes rpm
            ON rpm.mes = m.mes
        AND rpm.rubro = r.rubro
        ORDER BY r.rubro, m.mes;

        `) as {
      rubro: string;
      mes: number;
      total_mes: number;
      total_anual: number;
    }[];

    const grouped = incomesByHeading.reduce((acc: any, curr) => {
      const { mes, rubro, total_anual, total_mes } = curr;
      const month = getMonthName(mes);

      if (!acc[rubro]) {
        acc[rubro] = { total: 0 };
      }

      if (!acc.total) {
        acc.total = { total: 0 };
      }

      acc[rubro][month] = (acc[rubro][month] || 0) + Number(total_mes);
      acc[rubro].total = Number(total_anual);

      acc.total[month] = (acc.total[month] || 0) + Number(total_mes);
      acc.total.total += Number(total_mes);

      return acc;
    }, {});

    const { total, ...rest } = grouped;

    return {
      data: { ...rest, total },
      message: "Ingresos anuales por rubro",
    };
  });
