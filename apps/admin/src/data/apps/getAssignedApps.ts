import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const getAssignedApps = (userId: number, tenantName: string) =>
  openPrisma("Core", async (client: CoreClient) => {
    const tenant = await client.tenant.findUnique({
      where: { name: tenantName },
    });
    if (!tenant) {
      throw new PrismaClientValidationError("El tenant no existe.", {
        clientVersion: "1",
      });
    }
    const result = await client.usuariosApps.findMany({
      include: { app: true },
      where: {
        userId,
        tenantId: tenant.id,
      },
    });
    return {
      data: result.map(({ app }) => app),
      message: "Aplicaciones asignadas.",
    };
  });
