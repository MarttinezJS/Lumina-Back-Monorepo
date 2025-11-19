import { Context, Env } from "hono";
import { getIncomes } from "../../data";
import {
  convert2Boolean,
  convert2Number,
  convert2String,
  Tenant,
} from "@lumina/prisma";

export const getIncomesController = async (context: Context<Env, "", {}>) => {
  const { page, size, heading, status, observation, concept, amount } =
    context.req.query();
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await getIncomes(
    Number.parseInt(page ?? 0),
    Number.parseInt(size ?? 10),
    {
      headingId: convert2Number(heading),
      status: convert2Boolean(status),
      observation: convert2String(observation),
      concept: convert2String(concept),
      amount: convert2String(amount),
    },
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
