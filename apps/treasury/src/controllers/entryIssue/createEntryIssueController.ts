import { Context, Env } from "hono";
import { Issue } from "../../models";
import { createIssue } from "../../data";
import { Tenant } from "@lumina/prisma";

export const createEntryIssueController = async (
  context: Context<Env, "", {}>
) => {
  const { description, expense, income } = await context.req.json<Issue>();
  const tenant = context.res.headers.get("X-TENANT");

  if (!income && !expense) {
    return context.json({
      error: true,
      message: "La incidencia debe estar asociada a un ingreso o un egreso.",
    });
  }

  const resp = await createIssue(
    {
      description,
      expenseId: expense ? Number(expense) : null,
      incomeId: income ? Number(income) : null,
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
