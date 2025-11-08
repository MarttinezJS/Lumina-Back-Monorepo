import { Context, Env } from "hono";
import { updateMenu } from "../../data";

export const updateMenuController = async (
  context: Context<Env, "/menu/:id", {}>
) => {
  const { id } = context.req.param();
  const { id: _, ancestor, ...body } = await context.req.json();
  const resp = await updateMenu(Number(id), { ...body, ancestorId: ancestor });
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
