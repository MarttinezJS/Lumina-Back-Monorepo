import z from "zod/v4";

export const conceptSchema = z.object({
  name: z.string("Se necesita el nombre del concepto."),
});
