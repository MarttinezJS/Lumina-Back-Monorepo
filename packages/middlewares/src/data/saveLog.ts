import { openPrisma, Tenant } from "@lumina/prisma";
import { CoreClient } from "@lumina/prisma";
import { getNowDate } from "@lumina/utils";
import { Logs } from "../models";
export const saveLog = (data: Logs, tenant: Tenant) =>
  openPrisma(tenant, async (client: CoreClient) => ({
    data: await client.logs.create({
      data: {
        ...data,
        date: getNowDate(),
      },
    }),
  }));
