import { Context, Env } from "hono";
import { deleteIssue } from "../../data";
import { Tenant } from "@lumina/prisma";

export const deleteIssueController = async (
  context: Context<Env, "/:id", {}>
) => {
  const tenant = context.res.headers.get("X-TENANT");
  const id = await context.req.param("id");

  const resp = await deleteIssue(Number(id), tenant as Tenant);
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
