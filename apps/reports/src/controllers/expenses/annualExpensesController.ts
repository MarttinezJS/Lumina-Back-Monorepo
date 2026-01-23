import { Context, Env } from "hono";
import { getAnnualExpenses } from "../../data";
import { Tenant } from "@lumina/prisma";
import { generateReport } from "../../services";

export const annualExpensesController = async (
  context: Context<Env, "", {}>,
) => {
  const params = context.req.query();
  let year = Number.parseInt(params.year);
  const today = new Date(Date.now());
  if (isNaN(year)) {
    year = today.getFullYear();
  }
  const tenant = context.res.headers.get("X-TENANT") as Tenant;
  const resp = await getAnnualExpenses(year, tenant);

  if (resp.isError) {
    return context.json(
      {
        error: resp.isError,
        message: resp.message,
        status: resp.statusCode,
        body: resp.data,
        meta: resp.meta,
      },
      resp.statusCode,
    );
  }
  const data = resp.data;

  const pdf = await generateReport(
    "annualExpenses",
    {
      data,
      year,
      summary: {
        spent: data.total.total,
        budgeted: data.total.budgeted,
        remaining: data.total.budgeted - data.total.total,
      },
    },
    {
      landscape: true,
    },
  );

  context.res.headers.append("X-RESPONSE-TYPE", "FILE");
  return context.body(pdf, 200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename=Egresos_${year}.pdf`,
  });
};
