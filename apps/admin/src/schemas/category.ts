import z from "zod/v4";

export const categorySchema = z.object({
  name: z.string({
    error: (iss) => {
      if (iss.input == undefined) return "El nombre es obligatorio.";
      return "String no válido.";
    },
  }),
});
export type Category = z.infer<typeof categorySchema>;
