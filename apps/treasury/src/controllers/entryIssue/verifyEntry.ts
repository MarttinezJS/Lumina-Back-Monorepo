import { Context, Env } from "hono";
import { patchEntry } from "../../data";
import { Tenant } from "@lumina/prisma";

export const verifyEntry = async (context: Context<Env, "", {}>) => {
  const tenant = context.res.headers.get("X-TENANT");
  const { id, income, verified } = await context.req.json();
  const resp = await patchEntry(income, id, verified, tenant as Tenant);
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
