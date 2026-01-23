import { Context, Env } from "hono";
import { Category } from "../../schemas";
import {
  createCategory,
  getAllCategories,
  getPaginatedCategories,
} from "../../data";
import { convert2Boolean, convert2String } from "@lumina/prisma";

export const categoriesController = async (context: Context<Env, "", {}>) => {
  const body = await context.req.json<Category>();
  const resp = await createCategory(body.name);
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

export const getCategoriesController = async (
  context: Context<Env, "", {}>,
) => {
  const params = context.req.query();
  const resp = await getPaginatedCategories(
    Number(params.page || 0),
    Number(params.size || 10),
    {
      name: convert2String(params.name),
      status: convert2Boolean(params.active),
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

export const getAllCategoriesController = async (
  context: Context<Env, "", {}>,
) => {
  const resp = await getAllCategories();
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
