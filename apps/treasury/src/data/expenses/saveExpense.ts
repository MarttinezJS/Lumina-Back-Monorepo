import { openPrisma, Tenant } from "@lumina/prisma";
import { Egresos } from "../../models";

type Data = Omit<Egresos, "id" | "status">;
export const saveExpense = (data: Data, tenant: Tenant) =>
  openPrisma(tenant, async (client) => {
    const result = await client.egresos.create({ data });
    return {
      data: result,
      message: "Salida registrada correctamente.",
    };
  });
