import { getSignedCookie } from "hono/cookie";
import { decodeJwt } from "../services";
import { createMiddleware } from "hono/factory";

export const verifyToken = createMiddleware(async (c, next) => {
  const sessionCookie = await getSignedCookie(c, Bun.env.SECRET_SEED!, "auth");
  let pass = false;
  try {
    if (sessionCookie) {
      const data = await decodeJwt(sessionCookie);
      const tenant = data.payload.data.tenant;
      c.res.headers.append("X-TENANT", tenant);
      if (data != null) {
        pass = true;
      }
    }
  } catch (error: any) {
    pass = false;
  }
  if (!pass) {
    return c.json(
      {
        error: true,
        status: 401,
        message: "Usuario no autorizado",
      },
      401
    );
  }
  await next();
});
