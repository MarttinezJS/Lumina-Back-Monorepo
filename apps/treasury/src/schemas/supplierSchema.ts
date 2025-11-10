import { z } from "zod/v4";

export const supplierSchema = z.object({
  name: z.string("Nombre obligatorio."),
  identification: z.nullish(z.string("No es un texto válido.")),
  identificationType: z.nullish(z.string("No es un cadena válida")),
  dv: z.nullish(z.string("No es un texto válido.")),
});
