import { Context, Env } from "hono";
import { updateIdType } from "../../data";
import { Tenant } from "@lumina/prisma";

export const updateIdTypeController = async (
  context: Context<Env, "/identification-types/:id", {}>
) => {
  const { id } = context.req.param();
  const body = await context.req.json();
  const tenant = context.res.headers.get("X-Tenant");
  const resp = await updateIdType(Number(id), body, tenant as Tenant);
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
