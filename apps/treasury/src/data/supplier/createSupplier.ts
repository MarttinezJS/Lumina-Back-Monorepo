import {
  openPrisma,
  PrismaClientValidationError,
  Tenant,
} from "@lumina/prisma";

export const createSupplier = (data: Proveedores, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const found = await client.proveedores.findMany({
      where: {
        name: data.name,
        identification: data.identification,
      },
    });
    if (found.length > 0) {
      throw new PrismaClientValidationError(
        "Ya existe el proveedor registrado.",
        { clientVersion: "1" }
      );
    }
    const supplier = await client.proveedores.create({ data });

    return {
      data: supplier,
      message: "Proveedor guardado correctamente",
    };
  });
