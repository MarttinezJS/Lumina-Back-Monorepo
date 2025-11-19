import { Context, Env } from "hono";
import { assignTenant } from "../../data";

export const assignTenantController = async (
  context: Context<Env, "/users/:id/tenants", {}>
) => {
  const { tenants } = await context.req.json<{ tenants: [] }>();
  const params = context.req.param();
  const userId = Number.parseInt(params.id);
  if (isNaN(userId)) {
    return context.json(
      {
        error: true,
        message: "Se necesita el id del usuario.",
      },
      400
    );
  }
  const resp = await assignTenant(tenants, userId);
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
