import { Context, Env } from "hono";
import { authorize } from "../../data";

export const authorizedController = async (
  context: Context<Env, "/users/:id/authorize", {}>
) => {
  const id = context.req.param("id");
  const endpoint = context.req.query("endpoint");
  const resp = await authorize(Number(id), endpoint);
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
