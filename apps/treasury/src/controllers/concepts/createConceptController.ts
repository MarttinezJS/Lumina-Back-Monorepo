import { Context, Env } from "hono";
import { createConcept } from "../../data";
import { Tenant } from "@lumina/prisma";

export const createConceptController = async (
  context: Context<Env, "", {}>
) => {
  const { name } = await context.req.json<{ name: string }>();
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await createConcept({ name }, tenant as Tenant);
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
