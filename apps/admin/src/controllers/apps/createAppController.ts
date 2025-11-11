import { Context, Env } from "hono";
import { App } from "../../models";
import { createApp } from "../../data";

export const createAppController = async (context: Context<Env, "", {}>) => {
  const body = await context.req.json<App>();
  const resp = await createApp(body);
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
