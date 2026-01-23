import { Tenant } from "@lumina/prisma";
import { Context, Env } from "hono";
import { getAnnualIncomes } from "../../data";
import { generateReport } from "../../services";

export const getAnnualIncomesController = async (
  context: Context<Env, "", {}>,
) => {
  const params = await context.req.query();
  let year = Number(params.year);
  if (isNaN(year)) {
    const today = new Date(Date.now());
    year = today.getFullYear();
  }
  const tenant = context.res.headers.get("X-TENANT") as Tenant;
  const resp = await getAnnualIncomes(year, tenant);
  if (resp.isError) {
    return context.json(
      {
        error: resp.isError,
        message: resp.message,
        status: resp.statusCode,
        body: resp.data,
        meta: resp.meta,
      },
      resp.statusCode,
    );
  }

  const pdf = await generateReport("annualIncomes", {
    year,
    data: resp.data,
    spent: resp.data.total.total,
  });
  context.res.headers.append("X-RESPONSE-TYPE", "FILE");
  return context.body(pdf, 200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename=Ingresos_${year}.pdf`,
  });
};
