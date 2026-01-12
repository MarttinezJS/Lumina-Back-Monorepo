import { Tenant } from "@lumina/prisma";
import { Context, Env } from "hono";
import { getAnnualIncomes } from "../../data";

export const getAnnualIncomeController = async (
  context: Context<Env, "", {}>
) => {
  const tenant = context.res.headers.get("X-TENANT") as Tenant;
  const year = Number(
    context.req.query("year") ?? new Date(Date.now()).getFullYear()
  );

  const resp = await getAnnualIncomes(year, tenant);
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
