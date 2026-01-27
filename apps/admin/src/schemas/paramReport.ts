import z from "zod/v4";

export const paramReportSchema = z.object({
  variant: z.string({
    error: (iss) => {
      if (!iss) return "Se necesita la variante";
      return "String no válido";
    },
  }),
  name: z.string({
    error: (iss) => {
      if (!iss) return "Se necesita el nombre";
      return "String no válido";
    },
  }),
  report: z.number({
    error: (iss) => {
      if (!iss) return "Se necesita el id del reporte";
      return "Id no válido";
    },
  }),
  field: z.string({
    error: (iss) => {
      if (!iss) return "Se necesita el campo";
      return "String no válido";
    },
  }),
  queryUrl: z.string("String no válido").nullish(),
  type: z.string("String no válido").nullish(),
});
export type ParamReport = z.infer<typeof paramReportSchema>;
