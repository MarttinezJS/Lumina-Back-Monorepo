import { Context, Env } from "hono";
import { getSuppliers } from "../../data";
import {
  convert2Boolean,
  convert2Number,
  convert2String,
  Tenant,
} from "@lumina/prisma";

export const getSuppliersController = async (context: Context<Env, "", {}>) => {
  const { size, page, identification, dv, name, identificationType, status } =
    await context.req.query();
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await getSuppliers(
    Number.parseInt(page ?? 0),
    Number.parseInt(size ?? 10),
    {
      identification: convert2String(identification),
      dv: convert2Number(dv),
      name: convert2String(name),
      identificationType: convert2String(identificationType),
      status: convert2Boolean(status),
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
