import z from "zod/v4";

export const assignAppSchema = z.object({
  app: z.number("Se necesita el id de la app."),
  user: z.number("Se necesita el id del usuario."),
  tenant: z.number("Se necesita el id del tenant."),
});

export type AssignAppSchema = z.infer<typeof assignAppSchema>;
