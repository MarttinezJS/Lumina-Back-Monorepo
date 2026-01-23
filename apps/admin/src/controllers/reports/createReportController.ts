import { Context, Env } from "hono";
import { Report } from "../../schemas";
import { createReport } from "../../data";

export const createReportController = async (context: Context<Env, "", {}>) => {
  const body = await context.req.json<Report>();
  const resp = await createReport(body);
  return context.json(
    {
      error: resp.isError,
      message: resp.message,
      status: resp.statusCode,
      body: resp.data,
      meta: resp.meta,
    },
    resp.statusCode,
  );
};
