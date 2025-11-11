import z from "zod/v4";

export const appsSchema = z.object({
  name: z.string().nonempty("El nombre es obligatorio"),
  description: z.string().optional(),
  icon: z.string().nonempty("El icono es obligatorio"),
  url: z.string().nonempty("La URL es obligatoria"),
});
