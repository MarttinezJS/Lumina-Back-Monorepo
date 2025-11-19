import { Context, Env } from "hono";
import { getAppsByUser } from "../../data";

export const getUserApps = async (
  context: Context<Env, "Apps/user/:id", {}>
) => {
  const params = context.req.param();
  const userId = Number.parseInt(params.id);
  const tenant = context.res.headers.get("X-TENANT");
  if (isNaN(userId)) {
    return context.json(
      {
        error: true,
        message: "Valores inválidos, se necesitan los id",
      },
      400
    );
  }

  const resp = await getAppsByUser(userId, tenant ?? "");

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
