import z from "zod/v4";

export const expensesSchema = z.object({
  date: z.iso.date("No es una fecha válida"),
  supplier: z.string("Se necesita el nombre del proveedor."),
  supplierId: z.string("Se necesita el id del proveedor."),
  concept: z.string("Se necesita el concepto"),
  heading: z.number("Se necesita el id del rubro"),
  amount: z.number("Se necesita la cantidad"),
  observation: z.nullish(z.string("No es un texto válido")),
});
