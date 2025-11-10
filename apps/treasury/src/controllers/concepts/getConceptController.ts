import { Context, Env } from "hono";
import { getConcepts } from "../../data";
import { convert2Boolean, convert2String, Tenant } from "@lumina/prisma";

export const getConceptController = async (context: Context<Env, "", {}>) => {
  const { page, size, name, status } = await context.req.query();
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await getConcepts(
    Number.parseInt(page ?? 0),
    Number.parseInt(size ?? 10),
    tenant as Tenant,
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
      body: resp.isError ? resp.meta : resp.data,
    },
    resp.statusCode
  );
};
