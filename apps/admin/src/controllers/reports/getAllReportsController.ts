import { Context, Env } from "hono";
import { geAllReports } from "../../data";

export const getAllReportsController = async (
  context: Context<Env, "", {}>,
) => {
  const resp = await geAllReports();
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
