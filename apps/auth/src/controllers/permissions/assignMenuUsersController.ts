import { Context, Env } from "hono";
import { assignPermissions } from "../../data";
import { UserMenuRequest } from "../../schemas";

export const assignMenuUsersController = async (
  context: Context<Env, "", {}>
) => {
  const userMenu = await context.req.json<UserMenuRequest>();
  const tenant = context.res.headers.get("x-tenant");
  const resp = await assignPermissions(userMenu, tenant!);
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
