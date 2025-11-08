import { Context, Env } from "hono";
import { changePass } from "../../data";

export const changePassController = async (context: Context<Env, "", {}>) => {
  const id = context.req.param("id");
  const { password } = await context.req.json();
  const cryptPassword = Bun.password.hashSync(password);
  const resp = await changePass(Number(id), cryptPassword);
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
