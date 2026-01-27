import { Context, Env } from "hono";
import { getTenantsByUser } from "../../data";

export const getTenantByUserController = async (
  context: Context<Env, "/users/:id/tenants", {}>,
) => {
  const params = context.req.param();
  const resp = await getTenantsByUser(Number(params.id));
  return context.json(
    {
      error: resp.isError,
      message: resp.message,
      status: resp.statusCode,
      body: resp.data,
      meta: resp.meta,
    },
    resp.statusCode,
  );
};
