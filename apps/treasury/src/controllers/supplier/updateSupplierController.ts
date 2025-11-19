import { Context, Env } from "hono";
import { updateSupplier } from "../../data";
import { Tenant } from "@lumina/prisma";

export const updateSupplierController = async (
  context: Context<Env, "/:id", {}>
) => {
  const id = context.req.param("id");
  const supplierData = await context.req.json();
  const tenant = context.res.headers.get("X-Tenant");
  const resp = await updateSupplier(Number(id), supplierData, tenant as Tenant);
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
