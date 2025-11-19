import { Context, Env } from "hono";
import { getTenants } from "../data";

export const getTenantsController = async (
  context: Context<Env, "/:username/tenants", {}>
) => {
  const { username } = context.req.param();
  const { page, size, name } = context.req.query();
  const resp = await getTenants(
    username,
    Number.parseInt(page ?? 0),
    Number.parseInt(size ?? 10),
    name
  );
  return context.json({
    error: resp.isError,
    message: resp.message,
    status: resp.statusCode,
    body: resp.data,
    meta: resp.meta,
  });
};
