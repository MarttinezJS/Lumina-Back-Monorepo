import { validator } from "hono/validator";
import { z } from "zod/v4";

export const validateFields = (schema: z.ZodObject) =>
  validator("json", (data, context) => {
    try {
      const validate = schema.parse(data);
      return validate;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const respParsed = z.prettifyError(error);
        return context.json(
          {
            error: true,
            message: "Error en los campos.",
            body: error.issues.map((issue) => issue.message),
          },
          400
        );
      }
    }
  });
