import { Context, Env } from "hono";
import { deleteUserTenant } from "../../data";

export const deleteUserTenantController = async (
  context: Context<Env, "users/:userId/tenants/:tenantId", {}>,
) => {
  const params = context.req.param();
  const resp = await deleteUserTenant(
    Number(params.tenantId),
    Number(params.userId),
  );
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
