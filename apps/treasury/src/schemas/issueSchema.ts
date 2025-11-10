import z from "zod/v4";

export const issueSchema = z.object({
  description: z.string("Se necesita string válido."),
  income: z.nullish(z.number("Se necesita un id válido.")),
  expense: z.nullish(z.number("Se necesita un id válido.")),
});
export const verifySchema = z.object({
  income: z.boolean("Valor no válido"),
  id: z.number("Id no válido"),
  verified: z.boolean("Valor no válido"),
});

export const solveSchema = z.object({
  solved: z.boolean("Valor no válido"),
  id: z.number("Id no válido"),
});
