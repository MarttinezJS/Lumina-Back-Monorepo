import { Context, Env } from "hono";
import { TransactionalIncome } from "../../models";
import { saveTransactionalIncome } from "../../data";
import { Tenant } from "@lumina/prisma";

export const createTransactionalIncome = async (
  context: Context<Env, "", {}>
) => {
  const body = await context.req.json<TransactionalIncome>();
  const tenant = context.res.headers.get("X-TENANT");

  const ingresos = body.incomes.map<Partial<Ingresos>>(
    ({ amount, heading, observation }) => ({
      concept: body.concept,
      date: new Date(body.date),
      amount,
      headingId: heading,
      observation,
    })
  );
  const resp = await saveTransactionalIncome(
    ingresos as Ingresos[],
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
