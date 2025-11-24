import { Context, Env } from "hono";
import { usersByApps } from "../../data";

export const usersByAppsController = async (
  context: Context<Env, "/apps/:appId/tenant/:tenantId/users", {}>
) => {
  const params = context.req.param();
  const appId = Number.parseInt(params.appId);
  const tenantId = Number.parseInt(params.tenantId);

  const { user, included } = context.req.query();
  if (isNaN(appId) || isNaN(tenantId)) {
    return context.json({
      error: true,
      message: "El id de la app y del tenant deben ser válidos.",
    });
  }
  const resp = await usersByApps(appId, tenantId, user, included === "true");

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
