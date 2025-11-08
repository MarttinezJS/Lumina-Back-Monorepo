import { Context, Env } from "hono";
import { saveUser } from "../../data";
import { User } from "../../models";

const createUser = async (context: Context<Env, "/", {}>) => {
  const { password, ...body } = (await context.req.json()) as User;
  const cryptPassword = Bun.password.hashSync(password);
  try {
    let resp = await saveUser({ ...body, password: cryptPassword });

    return context.json(
      {
        error: resp.isError,
        message: resp.message,
        body: resp.data ?? resp.meta,
      },
      resp.statusCode
    );
  } catch (error: any) {
    console.error(error);
    return context.json(
      {
        error: true,
        message: "Error al crear usuario",
        body: error.message,
      },
      400
    );
  }
};

export { createUser };
