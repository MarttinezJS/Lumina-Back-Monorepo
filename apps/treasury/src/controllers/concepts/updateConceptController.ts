import { Context, Env } from "hono";
import { updateConcept } from "../../data";
import { Tenant } from "@lumina/prisma";

export const updateConceptController = async (
  context: Context<Env, "/concepts/:id", {}>
) => {
  const body = await context.req.json();
  const tenant = context.res.headers.get("X-TENANT");
  const { id } = context.req.param();
  const resp = await updateConcept(Number.parseInt(id), body, tenant as Tenant);
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
