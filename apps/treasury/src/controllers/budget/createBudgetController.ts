import { Context, Env } from "hono";
import { Budget } from "../../schemas";
import { createBudget } from "../../data";
import { Tenant } from "@lumina/prisma";

export const createBudgetController = async (context: Context<Env, "", {}>) => {
  const body = await context.req.json<Budget>();
  const tenant = context.res.headers.get("X-Tenant");
  const resp = await createBudget(
    body.headings.map(({ amount, heading }) => ({
      amount,
      headingId: heading,
      year: body.year,
    })),
    tenant as Tenant
  );

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
