import { Context, Env } from "hono";
import { getReports } from "../../data";
import {
  convert2Boolean,
  convert2Number,
  convert2String,
} from "@lumina/prisma";

export const getReportsController = async (context: Context<Env, "", {}>) => {
  const params = context.req.query();
  const resp = await getReports(
    Number(params.page || 0),
    Number(params.size || 10),
    {
      appsId: convert2Number(params.app),
      categoryReportsId: convert2Number(params.category),
      endpoint: convert2String(params.endpoint),
      name: convert2String(params.name),
      status: convert2Boolean(params.active),
      usuariosReportes: {
        every: {
          userId: convert2Number(params.user),
        },
      },
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
