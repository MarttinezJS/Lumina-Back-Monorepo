import { Context, Env } from "hono";
import { convert2Boolean, convert2String, Tenant } from "@lumina/prisma";
import { getIdType } from "../../data";

export const getIdentificationsTypeController = async (
  context: Context<Env, "", {}>
) => {
  const { page, size, status, name, abb } = await context.req.query();
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await getIdType(
    Number.parseInt(page ?? 0),
    Number.parseInt(size ?? 10),
    {
      status: convert2Boolean(status),
      name: convert2String(name),
      abb: convert2String(abb),
    },
    tenant as Tenant
  );

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
