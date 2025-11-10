import { PrismaClientOptions } from "@prisma/client/runtime/library";
import { PrismaClient as Cuestecitas } from "../generated/client-cuestecitas/client";
import { Subset } from "../generated/client-core/internal/prismaNamespace";
import { PrismaClient as Valledupar } from "../generated/client-valledupar/client";
import { PrismaClient as Core } from "../generated/client-core/client";

const options: Subset<PrismaClientOptions, PrismaClientOptions> = {
  omit: {
    usuarios: {
      password: true,
    },
  },
  errorFormat: "minimal",
};

export type Tenant = "Cuestecitas" | "Valledupar" | "Core";

export const getClient = (tenant: Tenant | null) => {
  switch (tenant) {
    case "Cuestecitas":
      return new Cuestecitas();
    case "Valledupar":
      return new Valledupar();
    case "Core":
      return new Core(options as any);

    default:
      return;
  }
};
