import { Context, Env } from "hono";
import { getTenants } from "../data";

export const getTenantsController = async (context: Context<Env, "", {}>) => {
  const { name, page, size } = await context.req.query();
  const resp = await getTenants(Number(page ?? 0), Number(size ?? 10), name);
  return context.json({
    error: resp.isError,
    message: resp.message,
    status: resp.statusCode,
    body: resp.isError ? resp.meta : resp.data,
  });
};
