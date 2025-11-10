import { openPrisma, Tenant } from "@lumina/prisma";

export const createConcept = (data: { name: string }, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const result = await client.conceptos.create({ data });
    return {
      data: result,
      message: "Concepto creado correctamente.",
    };
  });
