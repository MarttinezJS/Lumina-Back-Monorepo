import { openPrisma, Tenant } from "@lumina/prisma";
import { getMonthName } from "@lumina/utils";

interface Summation {
  mes: number;
  total: number;
}

export const getBalance = (month: number, year: number, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth <= 0) {
      prevMonth = 12;
      prevYear -= 1;
    }

    const incomeActual: Summation[] =
      await client.$queryRaw`select extract(month from fecha) as mes, sum(cantidad) as total from "Ingresos" where extract(year from fecha) =${year} and extract(month from fecha) = ${month} group by mes`;
    const incomePrev: Summation[] =
      await client.$queryRaw`select extract(month from fecha) as mes, sum(cantidad) as total from "Ingresos" where extract(year from fecha) =${prevYear} and extract(month from fecha) = ${prevMonth} group by mes`;
    const expenseActual: Summation[] =
      await client.$queryRaw`select extract(month from fecha) as mes, sum(cantidad) as total from "Egresos" where extract(year from fecha) =${year} and extract(month from fecha) = ${month} group by mes`;
    const expensePrev: Summation[] =
      await client.$queryRaw`select extract(month from fecha) as mes, sum(cantidad) as total from "Egresos" where extract(year from fecha) =${prevYear} and extract(month from fecha) = ${prevMonth} group by mes`;

    return {
      data: {
        incomes: {
          total: Number(incomeActual[0]?.total ?? 0),
          increase: getIncrease(incomeActual, incomePrev),
        },
        expenses: {
          total: Number(expenseActual[0]?.total ?? 0),
          increase: getIncrease(expenseActual, expensePrev),
        },
      },
    };
  });
const getIncrease = (a: Summation[], b: Summation[]) => {
  const final = Number(a[0]?.total ?? 0);
  const inicial = Number(b[0]?.total ?? 0);
  if (inicial === 0) {
    return 0;
  }
  return (final - inicial) / inicial;
};

export const getBalanceByYear = (year: number, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const incomes: Summation[] =
      await client.$queryRaw`select extract(month from fecha) as mes, sum(cantidad) as total from "Ingresos" where extract(year from fecha) = ${year} group by mes order by mes`;
    const expenses: Summation[] =
      await client.$queryRaw`select extract(month from fecha) as mes, sum(cantidad) as total from "Egresos" where extract(year from fecha) = ${year} group by mes order by mes`;

    const actualMonth = new Date(Date.now()).getMonth() + 1;
    const data = [...Array(actualMonth)].map((_, i) => {
      const income = incomes.find(({ mes }) => mes == i + 1);
      const expense = expenses.find(({ mes }) => mes == i + 1);
      return {
        month: getMonthName(i + 1),
        income: Number(income?.total ?? 0),
        expense: Number(expense?.total ?? 0),
        difference: Number(income?.total ?? 0) - Number(expense?.total ?? 0),
      };
    });
    return {
      data,
      message: "Balance anual",
    };
  });
