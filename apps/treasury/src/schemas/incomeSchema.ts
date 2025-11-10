import { z } from "zod/v4";
export const incomeSchema = z.object({
  date: z.iso.date("No es una fecha valida."),
  concept: z.string("Descripción obligatoria"),
  amount: z.number("La cantidad debe ser un número."),
  heading: z.number("Se necesita el id del rubro."),
});
