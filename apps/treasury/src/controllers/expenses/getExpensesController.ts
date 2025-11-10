import { Context, Env } from "hono";
import { getExpenses } from "../../data";
import {
  convert2Boolean,
  convert2Number,
  convert2String,
  Tenant,
} from "@lumina/prisma";

export const getExpensesController = async (context: Context<Env, "", {}>) => {
  const { concept, amount, heading, status, supplier, supplierId, page, size } =
    await context.req.query();
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await getExpenses(
    Number.parseInt(page ?? 0),
    Number.parseInt(size ?? 10),
    {
      concept: convert2String(concept),
      headingId: convert2Number(heading),
      amount: convert2Number(amount),
      supplier: convert2String(supplier),
      supplierId: convert2String(supplierId),
      status: convert2Boolean(status),
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
