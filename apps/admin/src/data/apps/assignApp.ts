import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";
import { getNowDate } from "@lumina/utils";

export const assignApp = (appId: number, userId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const app = await client.apps.findUnique({
      where: { id: appId },
    });
    if (!app)
      throw new PrismaClientValidationError("La aplicación no existe.", {
        clientVersion: "1",
      });
    const user = await client.usuarios.findUnique({
      where: { id: userId },
    });
    if (!user)
      throw new PrismaClientValidationError("El usuario no existe.", {
        clientVersion: "1",
      });

    const result = await client.usuariosApps.create({
      data: {
        appId,
        userId,
        assignedAt: getNowDate(),
      },
    });
    return {
      data: result,
      message: "Listado de apps.",
    };
  });
