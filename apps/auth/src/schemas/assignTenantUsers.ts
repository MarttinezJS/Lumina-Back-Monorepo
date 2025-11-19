import z from "zod/v4";

export const assignUserTenantSchema = z.object({
  tenants: z.array(z.number("Se necesita el id del tenant.")),
});
