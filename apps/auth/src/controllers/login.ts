import { Context, Env } from "hono";
import { findByUsername } from "../data";
import { generateJwt } from "../services";
import { v7 as uuid } from "uuid";
import { setSignedCookie } from "hono/cookie";
const login = async (c: Context<Env, "/", {}>) => {
  const { username, password, tenant } = await c.req.json();

  try {
    const resp = await findByUsername(username);

    const found = resp.data as any;
    if (found == null) {
      console.error("Usuario no existe");

      return c.json(
        {
          error: false,
          message: "Usuario o contraseña incorrecta.",
        },
        400
      );
    }
    if (!found.password || !Bun.password.verifySync(password, found.password)) {
      console.error("Contraseña incorrecta");
      return c.json(
        {
          error: false,
          message: "Usuario o contraseña incorrecta.",
        },
        400
      );
    }
    const tokenData = {
      id: found.id,
      name: `${found.firstName} ${found.lastName}`,
      username: found.username,
      tenant,
      pass: found.changePassword,
    };
    const token = await generateJwt(tokenData, 360_000);
    await setSignedCookie(c, "auth", token, Bun.env.SECRET_SEED!, {
      httpOnly: true,
      secure: Bun.env.ENVIRONMENT === "prd",
      sameSite: "lax",
      path: "/",
      domain: Bun.env.ENVIRONMENT === "prd" ? ".iglesia-imac.com" : undefined,
    });

    c.res.headers.append("no-p", uuid());
    return c.json({
      error: false,
      message: "",
      body: tokenData,
    });
  } catch (error) {
    console.error(error);

    return c.json(
      {
        error: true,
        message: "Error al iniciar sesión.",
        meta: error,
      },
      500
    );
  }
};

export { login };
