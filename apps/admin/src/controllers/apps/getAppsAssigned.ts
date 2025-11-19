import { Context, Env } from "hono";
import { getAssignedApps } from "../../data";

export const getAppsAssigned = async (
  context: Context<Env, "/apps/user/:id", {}>
) => {
  const tenant = context.res.headers.get("x-tenant");
  const params = context.req.param();
  const userId = Number.parseInt(params.id);
  if (isNaN(userId)) {
    return context.json({
      error: true,
      message: "Id no válido.",
    });
  }
  const resp = await getAssignedApps(userId, tenant!);
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
