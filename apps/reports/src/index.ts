import { Hono } from "hono";
import { registerLog, verifyToken } from "@lumina/middlewares";
import { setBoundData } from "@lumina/security";
import {
  annualExpensesController,
  getAnnualIncomesController,
} from "./controllers";

const serve = () => {
  const app = new Hono();
  setBoundData();
  app.use("*", verifyToken);
  app.use("*", registerLog);
  app.use("*", (c, next) => {
    console.info(`${c.req.path} | ${c.req.method}`);
    return next();
  });

  // Incomes
  app.get("/incomes/annual", getAnnualIncomesController);

  // Expenses
  app.get("/expenses/annual", annualExpensesController);

  Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT,
  });
  console.info(`Servidor corriendo en el puerto: ${process.env.PORT}`);
};

serve();
