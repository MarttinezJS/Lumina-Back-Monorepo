import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";
import { App } from "../../models";

export const createApp = (data: App) =>
  openPrisma("Core", async (client: CoreClient) => {
    const found = await client.apps.findFirst({
      where: {
        OR: [{ name: data.name }, { url: data.url }],
      },
    });
    if (found) {
      throw new PrismaClientValidationError(
        "Ya existe una app con ese nombre o url.",
        { clientVersion: "1" }
      );
    }
    const result = await client.apps.create({ data });
    return {
      data: result,
      message: "App creada correctamente.",
    };
  });
