import { Context, Env } from "hono";
import { modifyApp } from "../../data";

export const updateAppController = async (
  context: Context<Env, "/apps/:id", {}>
) => {
  const params = context.req.param();
  const id = Number.parseInt(params.id);
  const body = await context.req.json();
  if (isNaN(id)) {
    return context.json({
      error: true,
      message: "Id de la app no válido.",
    });
  }
  const resp = await modifyApp(body, id);
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
