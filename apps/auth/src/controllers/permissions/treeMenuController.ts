import { Context, Env } from "hono";
import { getMenuTree } from "../../data";

export const treeMenuController = async (
  context: Context<Env, "/users/:id/menus", {}>
) => {
  const id = context.req.param("id");
  const resp = await getMenuTree(Number.parseInt(id));

  return context.json(
    {
      error: resp.isError,
      message: resp.message,
      status: resp.statusCode,
      body: resp.isError ? resp.meta : resp.data,
    },
    resp.statusCode
  );
};
