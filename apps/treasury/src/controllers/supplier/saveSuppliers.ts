import { Context, Env } from "hono";
import { createSupplier } from "../../data";
import { Tenant } from "@lumina/prisma";

export const saveSuppliers = async (context: Context<Env, "", {}>) => {
  const body = await context.req.json();
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await createSupplier(body, tenant as Tenant);
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
