import z from "zod/v4";

export const headingSchema = z.object({
  name: z.string("Se necesita el nombre del rubro"),
  income: z.boolean("El campo income debe ser un booleano"),
});
