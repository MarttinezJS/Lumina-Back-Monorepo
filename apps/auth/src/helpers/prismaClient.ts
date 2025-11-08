import { PrismaClientOptions } from "@prisma/client/runtime/library";
import { PrismaClient as Cuestecitas } from "../../generated/client-cuestecitas/client";
import { Subset } from "../../generated/client-cuestecitas/internal/prismaNamespace";
import { PrismaClient as Valledupar } from "../../generated/client-valledupar/client";
import { PrismaClient as Core } from "../../generated/client-core/client";

const options: Subset<PrismaClientOptions, PrismaClientOptions> = {
  omit: {
    usuarios: {
      password: true,
    },
  },
  errorFormat: "minimal",
};

type Tenant = "Cuestecitas" | "Valledupar" | "Core";

export const getClient = (tenant: Tenant | string) => {
  switch (tenant) {
    case "Cuestecitas":
      return new Cuestecitas(options as any);
    case "Valledupar":
      return new Valledupar(options as any);
    case "Core":
      return new Core(options as any);

    default:
      return;
  }
};
