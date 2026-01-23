import { createMiddleware } from "hono/factory";
import { getSignedCookie } from "hono/cookie";
import { decodeJwt } from "@lumina/security";
import { saveLog } from "./data";
import { Actions } from "@lumina/prisma";

export const registerLog = createMiddleware(async (context, next) => {
  await next();
  const cookieSession = await getSignedCookie(
    context,
    Bun.env.SECRET_SEED!,
    "auth",
  );
  let tenant: "Core" = "Core";
  let username: string | undefined = undefined;
  if (cookieSession) {
    const resp = await decodeJwt(cookieSession);
    const data = resp?.data as { tenant: "Core"; username: string };
    tenant = data?.tenant ?? "Core";
    username = data?.username;
  }
  const resType = context.res.headers.get("X-RESPONSE-TYPE") ?? "JSON";
  let respStringify = "";
  switch (resType) {
    case "JSON":
      const resp = await context.res.clone().json();
      respStringify = await JSON.stringify(resp);

      break;
    case "FILE":
      break;

    default:
      respStringify = "Respuesta no legible.";
      break;
  }
  if (username == undefined) {
    return;
  }
  await saveLog(
    {
      action: getAction(context.req.method),
      endpoint: context.req.raw.url.split("/").slice(3).join("/"),
      username,
      resp: respStringify,
    },
    tenant,
  );
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
