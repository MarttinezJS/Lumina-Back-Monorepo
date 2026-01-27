import { Context, Env } from "hono";
import { ParamReport } from "../../schemas";
import { createParams } from "../../data";

export const createParamController = async (context: Context<Env, "", {}>) => {
  const body = await context.req.json<ParamReport>();
  const resp = await createParams(body);
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
