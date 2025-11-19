import { Context, Env } from "hono";
import { getMenuTree } from "../../data";

export const treeMenuController = async (
  context: Context<Env, "/menus/user/:userId/app/:appId/tree", {}>
) => {
  const params = context.req.param();
  const userId = Number.parseInt(params.userId);
  const appId = Number.parseInt(params.appId);
  if (isNaN(userId) || isNaN(appId)) {
    return;
  }
  const resp = await getMenuTree(userId, appId);

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
