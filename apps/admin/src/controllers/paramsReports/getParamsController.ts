import { Context, Env } from "hono";
import { getParams } from "../../data";
import { convert2Number, convert2String } from "@lumina/prisma";

export const getParamsController = async (context: Context<Env, "", {}>) => {
  const params = context.req.query();
  const resp = await getParams(
    Number(params.page ?? 0),
    Number(params.size ?? 10),
    {
      field: convert2String(params.field),
      name: convert2String(params.name),
      queryUrl: convert2String(params.queryUrl),
      reportsId: convert2Number(params.report),
      type: convert2String(params.type),
      variant: convert2String(params.variant),
    },
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
