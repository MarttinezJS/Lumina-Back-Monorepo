import { openPrisma, Tenant } from "@lumina/prisma";
import { getNowDate } from "@lumina/utils";

export const patchSolved = (id: number, solved: boolean, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const result = await client.incidencias.update({
      where: { id },
      data: {
        solved,
        solvedAt: getNowDate(),
      },
    });
    return {
      data: result,
      message: "Incidencia resuelta correctamente",
    };
  });
