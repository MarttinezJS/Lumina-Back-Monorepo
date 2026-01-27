import { Context, Env } from "hono";
import { getAllApps } from "../../data";

export const getAllAppsController = async (context: Context<Env, "", {}>) => {
  const resp = await getAllApps();
  return context.json(
    {
      error: resp.isError,
      message: resp.message,
      status: resp.statusCode,
      body: resp.data,
      meta: resp.meta,
    },
    resp.statusCode,
  );
};
