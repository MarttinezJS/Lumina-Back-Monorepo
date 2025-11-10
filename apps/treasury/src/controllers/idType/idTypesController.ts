import { Context, Env } from "hono";
import { createIdType } from "../../data";
import { Tenant } from "@lumina/prisma";

export const idTypesController = async (context: Context<Env, "", {}>) => {
  const data = await context.req.json<Tipo_Identificacion>();
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await createIdType(data, tenant as Tenant);
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
