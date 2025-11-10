import z from "zod/v4";

export const incomeTransactionalSchema = z.object({
  date: z.iso.date("No es una fecha válida"),
  concept: z.string("Se necesita el concepto"),
  incomes: z.array(
    z.object(
      {
        heading: z.number("Se necesita el id del rubro"),
        amount: z.number("Se necesita la cantidad"),
        observation: z.nullish(z.string("No es un texto válido")),
      },
      "Se necesita el arreglo de detalles de ingreso"
    )
  ),
});
