import { openPrisma, Tenant } from "@lumina/prisma";
import { getNowDate } from "@lumina/utils";

export const createIssue = (data: any, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const result = await client.incidencias.create({
      data: { ...data, createdAt: getNowDate() },
    });
    return {
      data: result,
      message: "Incidencia creada correctamente.",
    };
  });
