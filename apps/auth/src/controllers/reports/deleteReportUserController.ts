import { Context, Env } from "hono";
import { deleteUserReport } from "../../data";

export const deleteReportUserController = async (
  context: Context<Env, "/user/:userId/report/:reportId", {}>,
) => {
  const params = context.req.param();
  const resp = await deleteUserReport(
    Number(params.userId),
    Number(params.reportId),
  );
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
