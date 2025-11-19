import z from "zod/v4";

export const tenantSchema = z.object({
  name: z.string("Se necesita el nombre del tenant."),
});
