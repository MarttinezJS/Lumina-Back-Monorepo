import z from "zod";

export const budgetSchema = z.object({
  year: z.number("El año es obligatorio").int("Debe ser un número entero"),
  headings: z
    .array(
      z.object({
        heading: z.number("El ID del encabezado es obligatorio"),
        amount: z
          .number("El monto es obligatorio")
          .positive("El monto debe ser positivo"),
      })
    )
    .nonempty("Debe haber al menos un encabezado en el presupuesto"),
});

export type Budget = z.infer<typeof budgetSchema>;
