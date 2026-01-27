import { Context, Env } from "hono";
import { deleteReport } from "../../data";

export const deleteReportController = async (
  context: Context<Env, "/reports/:id", {}>,
) => {
  const params = context.req.param();
  const resp = await deleteReport(Number(params.id));
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
