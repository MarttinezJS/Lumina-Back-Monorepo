import { Context, Env } from "hono";
import { saveHeading } from "../../data";
import { Tenant } from "@lumina/prisma";
export const createHeadingController = async (
  context: Context<Env, "", {}>
) => {
  const data = await context.req.json<Rubros>();
  const tenant = context.res.headers.get("X-TENANT");
  const resp = await saveHeading(data, tenant as Tenant);
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
