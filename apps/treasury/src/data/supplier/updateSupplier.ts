import {
  openPrisma,
  PrismaClientValidationError,
  Tenant,
} from "@lumina/prisma";

export const updateSupplier = (id: number, data: Proveedores, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const found = await client.proveedores.findUnique({
      where: { id },
    });
    if (!found)
      throw new PrismaClientValidationError(
        `El proveedor con id ${id} no existe`,
        { clientVersion: "1" }
      );
    const result = await client.proveedores.update({
      where: { id },
      data,
    });
    return {
      data: result,
      message: "Proveedor actualizado correctamente.",
    };
  });
