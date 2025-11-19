import { ContentfulStatusCode } from "hono/utils/http-status";

export type ErrorResp<T> = {
  message: string | undefined;
  isError: boolean;
  meta?: Record<string, any>;
  data?: T[] | T;
  statusCode: ContentfulStatusCode;
};
