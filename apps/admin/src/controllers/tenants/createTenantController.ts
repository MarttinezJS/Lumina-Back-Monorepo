import { Context, Env } from "hono";
import { createTenant } from "../../data";

export const createTenantController = async (context: Context<Env, "", {}>) => {
  const { name } = await context.req.json();
  const resp = await createTenant(name);
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
