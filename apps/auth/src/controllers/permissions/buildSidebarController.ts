import { Context, Env } from "hono";
import { buildSidebar } from "../../data";

export const buildSidebarController = async (
  context: Context<Env, "/users/:id/menus/sidebar", {}>
) => {
  const id = context.req.param("id");
  const resp = await buildSidebar(Number.parseInt(id));
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
