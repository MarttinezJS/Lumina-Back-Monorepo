import { z } from "zod/v4";

export const loginSchema = z.object({
  username: z.string({
    error: "El usuario es obligatorio.",
  }),
  password: z.string({
    error: "Contraseña requerida.",
  }),
});
