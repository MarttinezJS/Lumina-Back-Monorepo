import { Context, Env } from "hono";
import { getReportsByUser } from "../../data";

export const getReportsAssignController = async (
  context: Context<Env, "/:id", {}>,
) => {
  const params = context.req.param();
  const resp = await getReportsByUser(Number(params.id));
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
