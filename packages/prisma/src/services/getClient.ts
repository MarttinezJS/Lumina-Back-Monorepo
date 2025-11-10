import { PrismaClientOptions } from "@prisma/client/runtime/library";
import { PrismaClient as Cuestecitas } from "../generated/client-cuestecitas/client";
import { Subset } from "../generated/client-core/internal/prismaNamespace";
import { PrismaClient as Valledupar } from "../generated/client-valledupar/client";
import { PrismaClient as Core } from "../generated/client-core/client";

const options: Subset<PrismaClientOptions, PrismaClientOptions> = {
  errorFormat: "minimal",
};

export type Tenant = "Cuestecitas" | "Valledupar" | "Core";

export const getClient = (tenant: Tenant | null) => {
  switch (tenant) {
    case "Cuestecitas":
      return new Cuestecitas(options as any);
    case "Valledupar":
      return new Valledupar(options as any);
    case "Core":
      return new Core({
        omit: {
          usuarios: {
            password: true,
          },
        },
        ...(options as any),
      });

    default:
      return;
  }
};
