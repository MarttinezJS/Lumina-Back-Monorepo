import {
  openPrisma,
  PrismaClientValidationError,
  Tenant,
} from "@lumina/prisma";

export const updateHeading = (id: number, data: Rubros, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const found = await client.rubros.findUnique({
      where: { id },
    });
    if (!found) {
      throw new PrismaClientValidationError("Rubro no encontrado", {
        clientVersion: "1",
      });
    }
    const result = await client.rubros.update({
      where: { id },
      data,
    });
    return {
      data: result,
      message: "Rubro actualizado correctamente",
    };
  });
