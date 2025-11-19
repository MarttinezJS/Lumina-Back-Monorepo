import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { decodeJwt } from "@lumina/security";

export const verifyToken = createMiddleware(async (context, next) => {
  const sessionCookie = await getSignedCookie(
    context,
    Bun.env.SECRET_SEED!,
    "auth"
  );
  if (sessionCookie) {
    const resp = await decodeJwt(sessionCookie);

    if (resp.isError) {
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
    }

    const data = resp.data as { tenant: string };
    const tenant = data.tenant;
    context.res.headers.append("X-TENANT", tenant);
    await next();
  }
});
