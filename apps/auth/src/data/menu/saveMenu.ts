import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { MenuFields } from "../../models";
import { openPrisma } from "../../services";
import { getClient } from "../../helpers/prismaClient";
import { PrismaClient } from "../../../generated/client-core/client";

export const saveMenu = ({ ancestor, ...data }: MenuFields) =>
  openPrisma(getClient("Core"), async (client: PrismaClient) => {
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
