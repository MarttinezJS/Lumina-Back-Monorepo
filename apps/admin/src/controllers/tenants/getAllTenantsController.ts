import { Context, Env } from "hono";
import { getAllTenants } from "../../data";

export const getAllTenantsController = async (
  context: Context<Env, "", {}>,
) => {
  const resp = await getAllTenants();
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
