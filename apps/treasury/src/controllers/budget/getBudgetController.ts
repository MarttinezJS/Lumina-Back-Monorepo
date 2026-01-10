import { Context, Env } from "hono";
import { getBudgetByYear } from "../../data";
import { Tenant } from "@lumina/prisma";

export const getBudgetController = async (context: Context<Env, "", {}>) => {
  const tenant = context.res.headers.get("X-Tenant") as Tenant;
  const year = parseInt(
    context.req.query("year") || new Date(Date.now()).getFullYear().toString()
  );
  const resp = await getBudgetByYear(year, tenant);
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
