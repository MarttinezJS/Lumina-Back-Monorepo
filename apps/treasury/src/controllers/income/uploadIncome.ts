import { Context, Env } from "hono";
import { parse } from "node-xlsx";
import { getHeadings } from "../../data";
import {
  convert2Boolean,
  ErrorResp,
  getClient,
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
  Tenant,
} from "@lumina/prisma";
import { ExcelDateToJSDate } from "@lumina/utils";

export const uploadIncome = async (context: Context<Env, "", {}>) => {
  const body = await context.req.parseBody();
  const tenant = context.res.headers.get("X-TENANT") as Tenant;
  const file = body.file as File;
  if (file == null) {
    return context.json(
      {
        error: false,
        message: "Archivo no válido.",
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
    const { data } = await getHeadings(0, 1000, tenant, {
      income: convert2Boolean("true"),
    });
    const headings = (data as any)!.results ?? [];
    const incomes: Ingresos[] = [];
    workSheet.forEach((sheet) => {
      sheet.data.forEach((row, _, array) => {
        const metaData = row.slice(0, 2);
        const headers = array[0];
        const data = row.slice(2);
        const serialNumber = Number.parseInt(metaData[0]);
        if (isNaN(serialNumber)) return;

        data.forEach((value, i) => {
          const headingName: string = headers[i + 2];
          const concept = metaData[1];
          if (headingName == "TOTAL" || concept == undefined) return undefined;

          const heading = headings.find((value: Rubros) => {
            return (
              value.name.toLowerCase().trim() ==
              headingName?.toLowerCase().trim()
            );
          });

          if (heading == undefined) {
            throw new PrismaClientValidationError(
              `No se encontró el rubro "${headingName}"`,
              { clientVersion: "1" }
            );
          }

          const income: Partial<Ingresos> = {
            date: ExcelDateToJSDate(serialNumber),
            concept: metaData[1],
            headingId: heading.id,
            amount: value,
          };
          incomes.push(income as Ingresos);
        });
      });
    });
    const resp = await client?.$transaction(
      incomes.map((data) => client.ingresos.create({ data }))
    );

    return context.json({
      error: false,
      message: "Archivo cargado.",
      status: 200,
      body: {
        created: resp?.length,
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
