import { Hono } from "hono";
import {
  assignAppController,
  createAppController,
  createTenantController,
  getAppsAssigned,
  getAppsController,
} from "./controllers";
import { registerLog, validateFields, verifyToken } from "@lumina/middlewares";
import { appsSchema, assignAppSchema, tenantSchema } from "./schemas";
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
  app.get("/apps/user/:id", getAppsAssigned);
  app.post(
    "/apps/assign",
    validateFields(assignAppSchema),
    assignAppController
  );

  // Tenants
  app.post("/tenants", validateFields(tenantSchema), createTenantController);
  app.post("/tenants/:id/apps");
  app.delete("/tenants/:tenantId/users/userId");
  app.delete("/tenants/:tenantId/apps/:appId");
  app.get("/tenants");
  app.put("/tenants");

  Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT,
  });
  console.info(`Servidor corriendo en el puerto: ${process.env.PORT}`);
};

serve();
