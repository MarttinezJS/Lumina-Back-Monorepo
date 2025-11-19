import { Context, Env } from "hono";
import { assignApp } from "../../data";

export const assignAppController = async (context: Context<Env, "", {}>) => {
  const { appId, userId } = await context.req.json();
  const resp = await assignApp(appId, userId);
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
