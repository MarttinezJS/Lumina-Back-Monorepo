import z from "zod/v4";

export const reportUserSchema = z.object({
  user: z.number({
    error: (iss) => {
      if (!iss) return "Se requiere el id del usuario";
      return "ID no válido.";
    },
  }),
  report: z.number({
    error: (iss) => {
      if (!iss) return "Se requiere el id del reporte";
      return "ID no válido.";
    },
  }),
});
export type ReportUser = z.infer<typeof reportUserSchema>;
