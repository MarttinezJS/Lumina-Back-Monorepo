import z from "zod/v4";

export const menuSchema = z.object({
  title: z.string({
    error: "Se necesita el titulo del menu",
  }),
  endpoint: z.string({
    error: "Se necesita la ruta del servidor",
  }),
  app: z.number({
    error: "Se necesita el id de la aplicación",
  }),
  frontPath: z.nullish(
    z.string({
      error: "Ruta no válida",
    })
  ),
  ancestor: z.nullish(
    z.number({
      error: "Debe ser el id del menu padre.",
    })
  ),
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
});
