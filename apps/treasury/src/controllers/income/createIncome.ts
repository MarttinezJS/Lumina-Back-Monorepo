import { Context, Env } from "hono";
import { saveIncome } from "../../data";
import { Tenant } from "@lumina/prisma";

export const createIncome = async (context: Context<Env, "", {}>) => {
  const { date: stringDate, ...data } = await context.req.json();
  const date = new Date(Date.parse(stringDate));
  const splitted = date.toLocaleString().split("/");
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await saveIncome(
    {
      ...data,
      day: Number.parseInt(splitted[1]),
      month: Number.parseInt(splitted[0]),
      year: Number.parseInt(splitted[2]),
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
