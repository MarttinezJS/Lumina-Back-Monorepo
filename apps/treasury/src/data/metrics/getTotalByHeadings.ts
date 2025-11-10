import { openPrisma, Tenant } from "@lumina/prisma";
import { getMonthName } from "@lumina/utils";

let headings: any[] = [];
const parseSerie = (serie: any[]) =>
  headings.map((heading, i) => {
    const found = serie.find((value) => value.rubro == heading.name);
    return {
      x: heading.name,
      y: found ? Number(found.total) : 0,
    };
  });

export const getTotalIncomeByHeadings = (
  month: number,
  year: number,
  tenant: Tenant
) =>
  openPrisma(tenant, async (client) => {
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth <= 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    headings = await client.rubros.findMany({
      where: {
        income: true,
      },
    });
    const prev: any[] =
      await client.$queryRaw`select R.nombre as Rubro, sum(cantidad) as Total from "Ingresos"
       join public."Rubros" R on R.id = "Ingresos".rubro_id
       where extract(year from fecha) =${prevYear} and extract(month from fecha) = ${prevMonth}
       group by Rubro`;
    const actual: any[] =
      await client.$queryRaw`select R.nombre as Rubro, sum(cantidad) as Total from "Ingresos"
       join public."Rubros" R on R.id = "Ingresos".rubro_id
       where extract(year from fecha) =${year} and extract(month from fecha) = ${month}
       group by Rubro`;

    return {
      message: "Datos de ingresos por rubros",
      data: [
        {
          name: getMonthName(prevMonth),
          data: parseSerie(prev),
        },
        {
          name: getMonthName(month),
          data: parseSerie(actual),
        },
      ],
    };
  });
export const getTotalExpensesByHeadings = (
  month: number,
  year: number,
  tenant: Tenant
) =>
  openPrisma(tenant, async (client) => {
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth <= 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    headings = await client.rubros.findMany({
      where: {
        income: false,
      },
    });
    const prev: any[] =
      await client.$queryRaw`select R.nombre as Rubro, sum(cantidad) as Total from "Egresos"
       join public."Rubros" R on R.id = "Egresos".rubro_id
       where extract(year from fecha) =${prevYear} and extract(month from fecha) = ${prevMonth}
       group by Rubro`;
    const actual: any[] =
      await client.$queryRaw`select R.nombre as Rubro, sum(cantidad) as Total from "Egresos"
       join public."Rubros" R on R.id = "Egresos".rubro_id
       where extract(year from fecha) =${year} and extract(month from fecha) = ${month}
       group by Rubro`;

    return {
      message: "Datos de egresos por rubros",
      data: [
        {
          name: getMonthName(prevMonth),
          data: parseSerie(prev),
        },
        {
          name: getMonthName(month),
          data: parseSerie(actual),
        },
      ],
    };
  });
