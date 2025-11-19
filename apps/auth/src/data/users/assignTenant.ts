import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";
import { getNowDate } from "@lumina/utils";

export const assignTenant = (tenants: number[], userId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const user = await client.usuarios.findUnique({ where: { id: userId } });
    if (!user) {
      throw new PrismaClientValidationError("El usuario no existe.", {
        clientVersion: "1",
      });
    }
    const result = await client.usuariosTenant.createManyAndReturn({
      data: tenants.map((tenantId) => ({
        tenantId,
        userId,
        createdAt: getNowDate(),
      })),
    });
    return {
      data: result,
      message: "Tenants asignados correctamente.",
    };
  });
