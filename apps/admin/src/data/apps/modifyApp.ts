import {
  openPrisma,
  CoreClient,
  PrismaClientValidationError,
} from "@lumina/prisma";
import { App } from "../../schemas";

export const modifyApp = (data: App, appId: number) =>
  openPrisma("Core", async (client: CoreClient) => {
    const found = await client.apps.findUnique({ where: { id: appId } });
    if (!found) {
      throw new PrismaClientValidationError(
        `La app #${appId} no se encontró.`,
        { clientVersion: "1" }
      );
    }
    const result = await client.apps.update({
      where: { id: appId },
      data: {
        ...data,
      },
    });
    return {
      data: result,
      message: "App modificada correctamente.",
    };
  });
