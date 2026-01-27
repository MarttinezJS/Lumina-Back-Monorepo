import { Context, Env } from "hono";
import { deleteParam } from "../../data";

export const deleteParamController = async (
  context: Context<Env, "/:id", {}>,
) => {
  const params = context.req.param();
  const resp = await deleteParam(Number(params.id));
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
