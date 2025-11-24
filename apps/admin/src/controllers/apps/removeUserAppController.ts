import { Context, Env } from "hono";
import { removeUserApp } from "../../data";

export const removeUserAppController = async (
  context: Context<Env, "/apps/:appId/tenant/:tenantId/users/:userId", {}>
) => {
  const params = context.req.param();
  const appId = Number.parseInt(params.appId);
  const tenantId = Number.parseInt(params.tenantId);
  const userId = Number.parseInt(params.userId);
  if (isNaN(appId) || isNaN(tenantId) || isNaN(userId)) {
    return context.json(
      { error: true, message: "los id deben ser numéricos." },
      400
    );
  }

  const resp = await removeUserApp(appId, userId, tenantId);
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
