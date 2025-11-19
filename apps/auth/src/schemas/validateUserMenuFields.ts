import z from "zod/v4";

export const userMenuSchema = z.object({
  userId: z.number({
    error: (iss) =>
      iss.input == undefined
        ? "Se necesita el id del usuario."
        : "El id debe ser un número.",
  }),
  appId: z.number({
    error: (iss) =>
      iss.input == undefined
        ? "Se necesita el id de la app."
        : "El id debe ser un número.",
  }),
  permissions: z.array(
    z.object({
      menuId: z.number({
        error: (iss) =>
          iss.input == undefined
            ? "Se necesita el id del menú."
            : "El id debe ser un número.",
      }),

      read: z.nullish(
        z.boolean({
          error: "Leer debe ser un booleano",
        })
      ),
      view: z.nullish(
        z.boolean({
          error: "Ver debe ser un booleano",
        })
      ),
      update: z.nullish(
        z.boolean({
          error: "Actualizar debe ser un booleano",
        })
      ),
      delete: z.nullish(
        z.boolean({
          error: "Eliminar debe ser un booleano",
        })
      ),
      print: z.nullish(
        z.boolean({
          error: "Imprimir debe ser un booleano",
        })
      ),
      report: z.nullish(
        z.boolean({
          error: "Reportes debe ser un booleano",
        })
      ),
    }),
    {
      error: (iss) =>
        iss.input == undefined
          ? "Se necesita la lista de permisos."
          : "Los permisos no son una lista válida.",
    }
  ),
});

export type UserMenuRequest = z.infer<typeof userMenuSchema>;
