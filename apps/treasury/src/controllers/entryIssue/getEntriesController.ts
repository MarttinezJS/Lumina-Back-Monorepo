import { Context, Env } from "hono";
import { getEntries } from "../../data";
import { Tenant } from "@lumina/prisma";

export const getEntriesController = async (context: Context<Env, "", {}>) => {
  const date = context.req.query("date");
  const income = context.req.query("income");
  const tenant = context.res.headers.get("X-TENANT");
  console.log();

  const resp = await getEntries(income == "true", tenant as Tenant, date);
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
