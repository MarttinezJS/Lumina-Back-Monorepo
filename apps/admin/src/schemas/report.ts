import z from "zod/v4";

export const reportSchema = z.object({
  name: z.string({
    error: (iss) => {
      if (iss.input == undefined) return "El nombre es obligatorio.";
      return "String no válido.";
    },
  }),
  url: z.string({
    error: (iss) => {
      if (iss.input == undefined) return "La ruta del reporte es obligatoria.";
      return "String no válido.";
    },
  }),
  app: z.number({
    error: (iss) => {
      if (iss.input == undefined) return "el id de la app es obligatorio.";
      return "ID no válido.";
    },
  }),
  category: z.number({
    error: (iss) => {
      if (iss.input == undefined)
        return "el id de la categoría es obligatorio.";
      return "ID no válido.";
    },
  }),
});
export type Report = z.infer<typeof reportSchema>;
