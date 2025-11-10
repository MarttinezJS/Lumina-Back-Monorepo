import { Context, Env } from "hono";
import { getHeadings } from "../../data";
import { convert2Boolean, convert2String } from "@lumina/prisma";
import { Tenant } from "@lumina/prisma";

export const getHeadingsController = async (context: Context<Env, "", {}>) => {
  const { page, size, name, income, status } = await context.req.query();
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await getHeadings(
    Number.parseInt(page ?? 0),
    Number.parseInt(size ?? 10),
    tenant as Tenant,
    {
      name: convert2String(name),
      income: convert2Boolean(income),
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
