import { Context, Env } from "hono";
import { updateUser } from "../../data";

export const updateUserController = async (context: Context<Env, "", {}>) => {
  const id = context.req.param("id");
  const { password, ...body } = await context.req.json();
  const resp = await updateUser(Number(id), body);
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
