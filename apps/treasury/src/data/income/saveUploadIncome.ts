import {
  ErrorResp,
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@lumina/prisma";

export const saveUploadIncome = async (data: Ingresos, client: any) => {
  let resp: ErrorResp<any> = {
    isError: false,
    message: "",
    statusCode: 200,
  };
  try {
    const saved = await client.ingresos.create({ data });
    resp.data = saved;
  } catch (error: any) {
    resp = {
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
  }
  return resp;
};
