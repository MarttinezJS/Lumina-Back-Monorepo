import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { ErrorResp } from "../models";
import { PrismaClient as ClientCuestecitas } from "../../generated/client-cuestecitas/client";
import { PrismaClient as ClientValledupar } from "../../generated/client-valledupar/client";
import { PrismaClient as Core } from "../../generated/client-core/client";

interface PrismaActionResp<T> {
  data: T | T[];
  message?: string;
}

export const openPrisma = async <T extends any>(
  tenant: ClientCuestecitas | ClientValledupar | Core | undefined,
  callback: (client: any) => Promise<PrismaActionResp<T>>
): Promise<ErrorResp<T>> => {
  let resp: ErrorResp<T> = {
    isError: false,
    message: "",
    statusCode: 200,
  };

  if (!tenant) {
    resp = {
      message: "Tenant no encontrado",
      isError: true,
      statusCode: 500,
    };
    return resp;
  }
  try {
    await tenant.$connect();
    const { data, message } = await callback(tenant);
    resp.statusCode = data instanceof Array && data.length == 0 ? 202 : 200;
    resp.data = data;
    resp.message = message;
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
    }
    if (error instanceof PrismaClientInitializationError) {
      const errorSplitted = error.message.split(`\n`);
      resp = {
        isError: true,
        message: `${error.name}: ${errorSplitted[errorSplitted.length - 1]}`,
        meta: {
          completeMessage: error.message,
        },
        statusCode: 500,
      };
    }
    if (
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
  } finally {
    await tenant.$disconnect();
  }
  return resp;
};
