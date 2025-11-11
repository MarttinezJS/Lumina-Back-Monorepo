import { Hono } from "hono";
import { createAppController, getAppsController } from "./controllers";
import { registerLog, validateFields, verifyToken } from "@lumina/middlewares";
import { appsSchema } from "./schemas";
import { setBoundData } from "@lumina/security";
const serve = () => {
  const app = new Hono();
  setBoundData();
  app.use("*", verifyToken);
  app.use("*", registerLog);
  app.use("*", (c, next) => {
    console.info(`${c.req.path} | ${c.req.method}`);
    return next();
  });

  // Apps
  app.post("/apps", validateFields(appsSchema), createAppController);
  app.get("/apps", getAppsController);

  Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT,
  });
  console.info(`Servidor corriendo en el puerto: ${process.env.PORT}`);
};

serve();
