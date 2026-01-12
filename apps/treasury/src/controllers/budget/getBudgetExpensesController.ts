import { Context, Env } from "hono";
import { getBudgetExpenses } from "../../data";
import { Tenant } from "@lumina/prisma";

export const getBudgetExpensesController = async (
  context: Context<Env, "", {}>
) => {
  const tenant = context.res.headers.get("X-Tenant") as Tenant;
  const year = Number(
    context.req.query("year") || new Date(Date.now()).getFullYear()
  );
  const resp = await getBudgetExpenses(year, tenant);
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
