import { Context, Env } from "hono";
import { patchSolved } from "../../data";
import { Tenant } from "@lumina/prisma";

export const solveIssue = async (context: Context<Env, "", {}>) => {
  const tenant = context.res.headers.get("X-TENANT");
  const { id, solved } = await context.req.json();
  const resp = await patchSolved(Number(id), solved, tenant as Tenant);
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
