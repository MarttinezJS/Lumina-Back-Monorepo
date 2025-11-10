import { Context, Env } from "hono";
import { parse } from "node-xlsx";
import { getHeadings } from "../../data";
import { Egresos } from "../../models";
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  getClient,
  Tenant,
  convert2Boolean,
  ErrorResp,
} from "@lumina/prisma";
import { ExcelDateToJSDate } from "@lumina/utils";

export const uploadExpensesController = async (
  context: Context<Env, "", {}>
) => {
  const body = await context.req.parseBody();
  const tenant = context.res.headers.get("X-TENANT") as Tenant;
  const file = body.file as File;
  if (!file) {
    return context.json(
      {
        error: true,
        message: "No se encontró archivo para subir.",
        status: 400,
      },
      400
    );
  }
  const workSheet = parse(await file.arrayBuffer());
  if (!tenant) {
    return context.json({
      error: true,
      message: "No hay tenant asignado.",
    });
  }
  const client: any = getClient(tenant);
  try {
    await client?.$connect();
    const dataHeadings = (
      await getHeadings(0, 1000, tenant, {
        income: convert2Boolean("false"),
      })
    ).data;
    const headings = (dataHeadings as { results: Rubros[] }).results ?? [];
    const expenses: Egresos[] = [];
    workSheet.forEach((sheet) => {
      const [headers, ...data] = sheet.data;
      data.forEach((row, _) => {
        const serialNumber = Number.parseInt(row[0]);

        row.slice(4).forEach((amount, i) => {
          if (isNaN(serialNumber)) {
            return;
          }
          const header = headers[i + 4];
          if (!header || header.trim() == "TOTAL") {
            return;
          }
          const found = headings.find(
            (h) => h.name.toLowerCase() == header.toLowerCase().trim()
          );
          if (!found) {
            throw new PrismaClientValidationError(
              `No se encuentra registrado el rubro "${header}"`,
              { clientVersion: "1" }
            );
          }
          const expense: Partial<Egresos> = {
            date: new Date(ExcelDateToJSDate(serialNumber)),
            supplier: row[1]?.trim(),
            supplierId: row[2]?.toString().trim(),
            concept: row[3]?.trim(),
            amount,
            headingId: found?.id,
          };
          expenses.push(expense as Egresos);
        });
      });
    });
    const resp = await client?.$transaction(
      expenses.map((data) => client.egresos.create({ data }))
    );

    return context.json({
      error: false,
      message: "Archivo cargado.",
      status: 200,
      body: {
        count: resp?.length,
        data: resp,
      },
    });
  } catch (error: any) {
    let resp: ErrorResp<any> = {
      isError: true,
      message: error.toString(),
      statusCode: 500,
    };
    if (error instanceof PrismaClientKnownRequestError) {
      const errorSplitted = error.message.split(`\n`);
      resp = {
        isError: true,
        message: `${error.code}: ${errorSplitted[errorSplitted.length - 1]}`,
        meta: {
          completeMessage: error.message,
        },
        statusCode: 400,
      };
    } else if (error instanceof PrismaClientInitializationError) {
      const errorSplitted = error.message.split(`\n`);

      resp = {
        isError: true,
        message: `${error.name}: ${errorSplitted[errorSplitted.length - 1]}`,
        meta: {
          completeMessage: error.message,
        },
        statusCode: 500,
      };
    } else if (
      error instanceof PrismaClientUnknownRequestError ||
      error instanceof PrismaClientRustPanicError ||
      error instanceof PrismaClientValidationError
    ) {
      resp = {
        isError: true,
        message: error.message,
        meta: {
          clientVersion: error.clientVersion,
        },
        statusCode: error instanceof PrismaClientRustPanicError ? 500 : 400,
      };
    }

    return context.json(
      {
        error: resp.isError,
        message: resp.message,
        status: resp.statusCode,
        body: resp.meta,
      },
      resp.statusCode
    );
  } finally {
    client?.$disconnect();
  }
};
