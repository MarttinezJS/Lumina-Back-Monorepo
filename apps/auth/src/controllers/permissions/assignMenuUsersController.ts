import { Context, Env } from "hono";
import { assignPermissions } from "../../data";
import { UserMenuRequest } from "../../schemas";

export const assignMenuUsersController = async (
  context: Context<Env, "", {}>
) => {
  const userMenu = (await context.req.json()) as UserMenuRequest;
  const resp = await assignPermissions(userMenu);
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
