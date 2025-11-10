import { Context, Env } from "hono";
import { build } from "node-xlsx";
import { getHeadings } from "../../data";
import { convert2Boolean, Tenant } from "@lumina/prisma";
export const downloadTemplateController = async (
  context: Context<Env, "", {}>
) => {
  const tenant = context.res.headers.get("X-TENANT");
  const { data: headings } = await getHeadings(0, 1_000_000, tenant as Tenant, {
    income: convert2Boolean("true"),
  });
  const results = Array.isArray(headings)
    ? headings.flatMap((h) => h.results?.map((h: Rubros) => h.name) ?? [])
    : (headings?.results?.map((h: Rubros) => h.name) ?? []);

  const data = [["FECHA", "CONCEPTO", ...results]];
  const buffer = build([{ name: "Ingresos", data, options: {} }]);
  context.res.headers.set(
    "Content-Disposition",
    'attachment; filename="template-incomes.xlsx"'
  );
  context.res.headers.set(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  return context.body(buffer as any, 200);
};
