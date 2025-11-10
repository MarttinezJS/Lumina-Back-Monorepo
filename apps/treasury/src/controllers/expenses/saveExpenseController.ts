import { Context, Env } from "hono";
import { saveExpense } from "../../data";
import { ExpenseReq } from "../../models";
import { Tenant } from "@lumina/prisma";

export const saveExpenseController = async (context: Context<Env, "", {}>) => {
  const data = await context.req.json<ExpenseReq>();
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await saveExpense(
    {
      headingId: data.heading,
      amount: data.amount,
      concept: data.concept,
      observation: data.observation,
      supplierId: data.supplierId,
      date: new Date(data.date),
      supplier: data.supplier,
    },
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
