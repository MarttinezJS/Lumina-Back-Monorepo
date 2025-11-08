import { z } from "zod/v4";

export const changePassSchema = z.object({
  password: z.string("Contraseña requerida."),
});

export const userSchema = z.object({
  firstName: z.string({
    error: "Se necesita los nombres.",
  }),
  lastName: z.string({
    error: "Se necesitan los apellidos.",
  }),
  email: z.email({
    error: (iss) => {
      if (iss.input == undefined) return "Se requiere el correo";
      return "Correo no válido.";
    },
    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
  }),
  username: z.string({
    error: "El usuario es requerido.",
  }),
  password: z.string({
    error: "La contraseña es requerida.",
  }),
});

export const updateUserSchema = z.object({
  firstName: z.string({
    error: "Se necesita los nombres.",
  }),
  lastName: z.string({
    error: "Se necesitan los apellidos.",
  }),
  email: z.email({
    error: (iss) => {
      if (iss.input == undefined) return "Se requiere el correo";
      return "Correo no válido.";
    },
    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
  }),
  username: z.string({
    error: "El usuario es requerido.",
  }),
});
