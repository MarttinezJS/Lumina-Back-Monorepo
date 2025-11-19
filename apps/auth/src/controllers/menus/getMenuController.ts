import { Context, Env } from "hono";
import { getMenu } from "../../data";
import {
  convert2Boolean,
  convert2Number,
  convert2String,
} from "@lumina/prisma";

export const getMenuController = async (context: Context<Env, "", {}>) => {
  try {
    const {
      size,
      page,
      status,
      ancestor,
      endpoint,
      frontPath,
      title,
      description,
    } = await context.req.query();
    const resp = await getMenu(
      Number.parseInt(page ?? 0),
      Number.parseInt(size ?? 10),
      {
        ancestorId: convert2Number(ancestor),
        endpoint: convert2String(endpoint),
        status: convert2Boolean(status),
        frontPath: convert2String(frontPath),
        title: convert2String(title),
        description: convert2String(description),
      }
    );
    return context.json(
      {
        error: resp.isError,
        message: resp.message,
        status: resp.statusCode,
        body: resp.data,
        meta: resp.meta,
      },
      resp.statusCode
    );
  } catch (error: any) {
    return context.json({
      status: 500,
      error: true,
      message: "Error de servidor",
      body: error.message,
    });
  }
};
