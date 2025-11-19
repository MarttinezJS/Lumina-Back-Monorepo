import { Context, Env } from "hono";
import { updateIncome } from "../../data";
import { Tenant } from "@lumina/prisma";

export const updateIncomeController = async (context: Context<Env, "", {}>) => {
  const body = await context.req.json();
  const id = context.req.param("id");
  const tenant = context.res.headers.get("X-Tenant");
  const resp = await updateIncome(Number(id), body, tenant as Tenant);
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
