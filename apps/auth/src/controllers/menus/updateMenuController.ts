import { Context, Env } from "hono";
import { updateMenu } from "../../data";

export const updateMenuController = async (
  context: Context<Env, "/menu/:id", {}>
) => {
  const { id } = context.req.param();
  const { id: _, ancestor, app, ...body } = await context.req.json();
  const resp = await updateMenu(Number(id), {
    ...body,
    ancestorId: ancestor,
    appId: app,
  });
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
