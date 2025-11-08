import { Context, Env } from "hono";
import { findUserById, getAll } from "../../data";

export const getUserById = async (context: Context<Env, "/users/:id", {}>) => {
  const { id } = context.req.param();
  try {
    const resp = await findUserById(Number.parseInt(id));
    return context.json(
      {
        error: resp.isError,
        message: resp.message,
        body: resp.data ?? resp.meta,
      },
      resp.statusCode
    );
  } catch (error) {
    return context.json({
      error: false,
      message: "Error al buscar usuario.",
      body: error,
    });
  }
};

export const getAllUsers = async (context: Context<Env, "/", {}>) => {
  const { size, page } = await context.req.query();
  const resp = await getAll(
    Number.parseInt(page ?? 0),
    Number.parseInt(size ?? 10)
  );
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
