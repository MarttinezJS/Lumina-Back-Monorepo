import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";
import { UserMenuRequest } from "../../schemas";

export const assignPermissions = (
  { permissions, userId, appId }: UserMenuRequest,
  tenantName: string
) =>
  openPrisma("Core", async (client: CoreClient) => {
    const tenant = await client.tenant.findUnique({
      where: { name: tenantName },
    });
    if (!tenant) {
      throw new PrismaClientValidationError("Tenant no encontrado", {
        clientVersion: "1",
      });
    }
    await client.permisos.deleteMany({
      where: {
        tenantId: tenant.id,
        usuarioId: userId,
        Menu: { appId },
      },
    });

    const data = permissions.map(({ menuId, ...permissions }) => ({
      menuId: menuId,
      usuarioId: userId,
      tenantId: tenant.id,
      ...permissions,
    }));

    const inserted = await client.permisos.createMany({
      data,
    });

    return {
      data: inserted,
      message: "Permisos asignados correctamente",
    };
  });
