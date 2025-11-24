import { Context, Env } from "hono";
import { assignApp } from "../../data";
import { AssignAppSchema } from "../../schemas";

export const assignAppController = async (context: Context<Env, "", {}>) => {
  const { app, tenant, user } = await context.req.json<AssignAppSchema>();
  const resp = await assignApp(app, user, tenant);
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
