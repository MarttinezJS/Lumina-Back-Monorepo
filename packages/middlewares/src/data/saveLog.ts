import { openPrisma, Tenant } from "@lumina/prisma";
import { Logs } from "../models";
export const saveLog = (data: Logs, tenant: Tenant) =>
  openPrisma(tenant, async (client) => ({
    data: await client.logs.create({ data }),
  }));
