import { Hono } from "hono";
import { registerLog, validateFields, verifyToken } from "@lumina/middlewares";
import { setBoundData } from "@lumina/security";
import {
  annualExpensesController,
  getAnnualIncomesController,
} from "./controllers";

const serve = async () => {
  const app = new Hono();
  setBoundData();
  app.use("*", verifyToken);
  app.use("*", registerLog);
  app.use("*", (c, next) => {
    console.info(`${c.req.path} | ${c.req.method}`);
    return next();
  });

  // Incomes
  app.use("/incomes/anual", getAnnualIncomesController);

  // Expenses
  app.use("/expenses/anual", annualExpensesController);
  Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT,
  });
  console.info(`Servidor corriendo en el puerto: ${process.env.PORT}`);
};

serve();
