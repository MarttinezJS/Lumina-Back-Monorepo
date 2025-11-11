import { Context, Env } from "hono";
import { getApps } from "../../data";
import { convert2Boolean, convert2String } from "@lumina/prisma";

export const getAppsController = async (context: Context<Env, "", {}>) => {
  const { name, url, status } = context.req.query();
  const resp = await getApps({
    name: convert2String(name),
    url: convert2String(url),
    status: convert2Boolean(status),
  });

  return context.json(
    {
      error: resp.isError,
      message: resp.message,
      status: resp.statusCode,
      body: resp.isError ? resp.meta : resp.data,
    },
    resp.statusCode
  );
};
