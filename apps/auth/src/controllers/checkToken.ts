import { Context, Env } from "hono";
import { decodeJwt } from "../services";
import { getSignedCookie } from "hono/cookie";

export const checkToken = async (context: Context<Env, "/users/token", {}>) => {
  try {
    const cookie = await getSignedCookie(context, Bun.env.SECRET_SEED!, "auth");
    if (!cookie) {
      return context.json({ error: true, message: "Sesión no válida." }, 401);
    }
    const resp = await decodeJwt(cookie);
    if (resp) {
      return context.json(
        { error: false, message: "verificado", body: resp.payload.data },
        200
      );
    }
    return context.json({
      error: true,
      message: "Token no verificado",
    });
  } catch (error) {
    return context.json({
      error: true,
      message: "Error al verificar",
      body: error,
    });
  }
};
