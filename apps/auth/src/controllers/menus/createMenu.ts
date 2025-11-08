import { Context, Env } from "hono";
import { saveMenu } from "../../data";

export const createMenu = async (context: Context<Env, "", {}>) => {
  const data = await context.req.json();
  const resp = await saveMenu(data);
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
