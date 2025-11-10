import { MenuFields } from "../../models";
import {
  CoreClient,
  openPrisma,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const saveMenu = ({ ancestor, ...data }: MenuFields) =>
  openPrisma("Core", async (client: CoreClient) => {
    const found = await client.menu.findUnique({
      where: { endpoint: data.endpoint },
    });
    if (found) {
      throw new PrismaClientValidationError("El menú ya está registrado", {
        clientVersion: "1",
      });
    }
    Object.assign(data, { ancestorId: ancestor });
    const menuCreated = await client.menu.create({ data });
    return {
      data: menuCreated,
      message: "Menú creado correctamente.",
    };
  });
