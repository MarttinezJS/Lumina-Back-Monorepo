import { Context, Env } from "hono";
import { buildSidebar } from "../../data";

export const buildSidebarController = async (
  context: Context<Env, "/menus/user/:userId/app/:appName/sidebar", {}>
) => {
  const params = context.req.param();
  const userId = Number.parseInt(params.userId);
  const appName = params.appName;
  if (isNaN(userId) || !appName) {
    return context.json(
      {
        error: true,
        message: "El id del usuario o el nombre de la app no son válidos.",
      },
      400
    );
  }
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await buildSidebar(userId, appName, tenant!);
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
