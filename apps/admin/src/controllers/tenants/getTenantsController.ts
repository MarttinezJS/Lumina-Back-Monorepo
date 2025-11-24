import { Context, Env } from "hono";
import { getTenants } from "../../data";
import { convert2Boolean, convert2String } from "@lumina/prisma";

export const getTenantsController = async (context: Context<Env, "", {}>) => {
  const { page, size, name, status } = context.req.query();
  const resp = await getTenants(
    Number.parseInt(page ?? 0),
    Number.parseInt(size ?? 10),
    {
      name: convert2String(name),
      status: convert2Boolean(status),
    }
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
