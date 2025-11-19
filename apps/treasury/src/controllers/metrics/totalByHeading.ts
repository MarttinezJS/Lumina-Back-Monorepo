import { Context, Env } from "hono";
import {
  getTotalExpensesByHeadings,
  getTotalIncomeByHeadings,
} from "../../data";
import { Tenant } from "@lumina/prisma";

export const totalByHeading = async (
  context: Context<Env, "metrics/headings/:month/:year", {}>
) => {
  const tenant = context.res.headers.get("X-TENANT");
  const incomes = context.req.query("incomes");
  const month = Number.parseInt(context.req.param("month")),
    year = Number.parseInt(context.req.param("year"));
  if (isNaN(month) || isNaN(year)) {
    return context.json({
      ok: true,
      message: "El mes o el año, no son válidos.",
    });
  }
  const resp =
    incomes === "true"
      ? await getTotalIncomeByHeadings(month, year, tenant as Tenant)
      : await getTotalExpensesByHeadings(month, year, tenant as Tenant);
  return context.json(
    {
      error: resp.isError,
      message: resp.message,
      status: resp.statusCode,
      body: resp.data,
      meta: resp.meta,
    },
    resp.statusCode
  );
};
