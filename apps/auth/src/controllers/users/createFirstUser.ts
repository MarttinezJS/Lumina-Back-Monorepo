import { Context, Env } from "hono";
import { User } from "../../models";
import { saveUser } from "../../data";

export const createFirstUser = async (context: Context<Env, "", {}>) => {
  const { password, ...body } = await context.req.json<User>();
  const cryptPassword = Bun.password.hashSync(password);
  const resp = await saveUser({ ...body, password: cryptPassword });

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
