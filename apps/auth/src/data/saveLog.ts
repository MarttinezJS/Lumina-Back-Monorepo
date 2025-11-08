import { getClient } from "../helpers/prismaClient";
import { openPrisma } from "../services";

export const saveLog = (data: Logs, tenant: string) =>
  openPrisma(getClient(tenant), async (client) => ({
    data: await client.logs.create({ data }),
  }));
