import { openPrisma, Tenant } from "@lumina/prisma";

export const deleteIssue = (id: number, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const result = await client.incidencias.delete({
      where: { id },
    });
    return {
      data: result,
      message: "incidencia eliminada correctamente.",
    };
  });
