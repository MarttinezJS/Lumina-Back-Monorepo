import { Context, Env } from "hono";
import { updateExpense } from "../../data";
import { Tenant } from "@lumina/prisma";

export const updateExpenseController = async (
  context: Context<Env, "/expenses/:id", {}>
) => {
  const { date, heading, ...body } = await context.req.json();
  const id = context.req.param("id");
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await updateExpense(
    Number.parseInt(id),
    { ...body, date: new Date(date), headingId: heading },
    tenant as Tenant
  );
  return context.json(
    {
      error: resp.isError,
      message: resp.message,
      status: resp.statusCode,
      body: resp.isError ? resp.meta : resp.data,
    },
    resp.statusCode
  );
};
