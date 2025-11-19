import { Context, Env } from "hono";
import { deleteCookie } from "hono/cookie";

export const logout = async (context: Context<Env, "", {}>) => {
  deleteCookie(context, "auth", {
    path: "/",
    domain: Bun.env.ENVIRONMENT === "prd" ? ".iglesia-imac.com" : undefined,
  });

  return context.json({
    ok: true,
    message: "Sesión Finalizada",
  });
};
