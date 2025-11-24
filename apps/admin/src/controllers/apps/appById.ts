import { Context, Env } from "hono";
import { getAppById } from "../../data";

export const appById = async (context: Context<Env, "/aps/:id", {}>) => {
  const params = context.req.param();
  const id = Number.parseInt(params.id);
  if (isNaN(id)) {
    return context.json({
      error: true,
      message: "Id de la aplicación no válido.",
    });
  }
  const resp = await getAppById(id);
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
