import { Context, Env } from "hono";
import { getParamByReport } from "../../data";

export const getParamsByReport = async (context: Context<Env, "/:id", {}>) => {
  const params = context.req.param();
  const resp = await getParamByReport(Number(params.id));
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
