import z from "zod/v4";

export const idTypeSchema = z.object({
  name: z.string("El nombre es obligatorio"),
  abb: z.string("Se necesita la abreviatura"),
});
