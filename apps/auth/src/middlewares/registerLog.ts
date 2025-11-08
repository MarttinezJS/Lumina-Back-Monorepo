import { createMiddleware } from "hono/factory";
import { saveLog } from "../data";
import { decodeJwt } from "../services";
import { getSignedCookie } from "hono/cookie";
import { Actions } from "@lumina/prisma";
export const registerLog = createMiddleware(async (context, next) => {
  await next();
  try {
    const cookieSession = await getSignedCookie(
      context,
      Bun.env.SECRET_SEED!,
      "auth"
    );
    if (cookieSession) {
      const data = await decodeJwt(cookieSession);
      const resp = await context.res.clone().json();
      const respStringify = await JSON.stringify(resp);
      const tenant = data.payload.data.tenant;

      await saveLog(
        {
          action: getAction(context.req.method),
          endpoint: context.req.raw.url.split("/").slice(3).join("/"),
          userId: data.payload.data.id,
          resp: respStringify,
        } as Logs,
        tenant
      );
    }
  } catch (error: any) {
    console.warn("Log no registrado: ", error.message);
  }
});

const getAction: any = (method: string) => {
  switch (method) {
    case "POST":
      return Actions.guardar;
    case "GET":
      return Actions.consultar;
    case "PUT":
      return Actions.editar;
    case "DELETE":
      return Actions.eliminar;
  }
};
