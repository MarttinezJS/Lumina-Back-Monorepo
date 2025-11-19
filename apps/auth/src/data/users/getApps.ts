import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const getAppsByUser = (userId: number, tenantName: string) =>
  openPrisma("Core", async (client: CoreClient) => {
    const user = await client.usuarios.findUnique({
      where: { id: userId },
    });
    if (!user)
      throw new PrismaClientValidationError("El usuario no existe.", {
        clientVersion: "1",
      });
    const tenant = await client.tenant.findUnique({
      where: { name: tenantName },
    });
    if (!tenant)
      throw new PrismaClientValidationError("El tenant no fue encontrado.", {
        clientVersion: "1",
      });

    const data = await client.usuariosApps.findMany({
      include: {
        app: true,
        user: true,
      },
      omit: {
        appId: true,
        userId: true,
      },
      where: {
        AND: [
          { userId },
          { app: { tenantApps: { every: { tenantId: tenant.id } } } },
        ],
      },
      orderBy: {
        app: {
          name: "asc",
        },
      },
    });
    return {
      data: data.map(({ app }) => app),
      message: "Consulta de aplicaciones por usuario.",
    };
  });
