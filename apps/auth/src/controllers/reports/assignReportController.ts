import { Context, Env } from "hono";
import { ReportUser } from "../../schemas";
import { assignReport } from "../../data";

export const assignReportController = async (context: Context<Env, "", {}>) => {
  const body = await context.req.json<ReportUser>();
  const resp = await assignReport(body.user, body.report);
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
