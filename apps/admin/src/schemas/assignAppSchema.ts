import z from "zod/v4";

export const assignAppSchema = z.object({
  appId: z.number("Se necesita el id de la app."),
  userId: z.number("Se necesita el id del usuario."),
});
