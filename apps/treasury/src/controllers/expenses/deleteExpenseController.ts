import { Context, Env } from "hono";
import { deleteExpense } from "../../data";
import { Tenant } from "@lumina/prisma";

export const deleteExpenseController = async (
  context: Context<Env, "/expenses/:id", {}>
) => {
  const params = context.req.param();
  const id = Number.parseInt(params.id);
  if (isNaN(id)) {
    return context.json({ error: true, message: "ID inválido" }, 400);
  }
  const tenant = context.res.headers.get("X-Tenant");
  const resp = await deleteExpense(id, tenant as Tenant);
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
