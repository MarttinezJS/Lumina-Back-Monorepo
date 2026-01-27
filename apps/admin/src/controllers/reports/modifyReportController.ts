import { Context, Env } from "hono";
import { modifyReport } from "../../data";

export const modifyReportController = async (
  context: Context<Env, "/reports/:id", {}>,
) => {
  const params = context.req.param();
  const body = await context.req.json<Report>();
  const resp = await modifyReport(body, Number(params.id));
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
