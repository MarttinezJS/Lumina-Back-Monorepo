import { Context, Env } from "hono";
import { getAppByUserTenant } from "../../data";

export const getAppsByUserTenantController = async (
  context: Context<Env, "/apps/user/:id/tenant/:tenantId", {}>,
) => {
  const { id, tenantId } = context.req.param();
  const resp = await getAppByUserTenant(Number(id), Number(tenantId));
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
