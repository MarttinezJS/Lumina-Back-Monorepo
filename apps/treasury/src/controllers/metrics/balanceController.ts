import { Context, Env } from "hono";
import { getBalance, getBalanceByYear } from "../../data";
import { Tenant } from "@lumina/prisma";

export const balanceController = async (
  context: Context<Env, "/metrics/balance/:month/:year", {}>
) => {
  const tenant = context.res.headers.get("X-TENANT");
  const month = Number.parseInt(context.req.param("month")),
    year = Number.parseInt(context.req.param("year"));
  if (isNaN(month) || isNaN(year)) {
    return context.json({
      ok: true,
      message: "El mes o el año, no son válidos.",
    });
  }

  const resp = await getBalance(month, year, tenant as Tenant);
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

export const balanceYearController = async (
  context: Context<Env, "/metrics/balance/:year", {}>
) => {
  const tenant = context.res.headers.get("X-TENANT");
  const year = Number.parseInt(context.req.param("year"));
  if (isNaN(year)) {
    return context.json({
      ok: true,
      message: "El año no es válido.",
    });
  }
  const resp = await getBalanceByYear(year, tenant as Tenant);
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
