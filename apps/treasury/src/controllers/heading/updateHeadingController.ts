import { Context, Env } from "hono";
import { updateHeading } from "../../data";
import { Tenant } from "@lumina/prisma";

export const updateHeadingController = async (
  context: Context<Env, "/heading/:id", {}>
) => {
  const id = context.req.param("id");
  const data = await context.req.json();
  const tenant = context.res.headers.get("X-Tenant");
  const resp = await updateHeading(Number(id), data, tenant as Tenant);
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
