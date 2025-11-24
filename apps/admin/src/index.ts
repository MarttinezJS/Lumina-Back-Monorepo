import { Hono } from "hono";
import {
  appById,
  assignAppController,
  createAppController,
  createTenantController,
  getAppsAssigned,
  getAppsController,
  getTenantsController,
  removeUserAppController,
  updateAppController,
  usersByAppsController,
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
  app.get("/apps/:id", appById);
  app.get("/apps/:appId/tenant/:tenantId/users", usersByAppsController);
  app.put("/apps/:id", updateAppController);
  app.get("/apps/user/:id", getAppsAssigned);
  app.delete(
    "/apps/:appId/tenant/:tenantId/users/:userId",
    removeUserAppController
  );
  app.post(
    "/apps/assign",
    validateFields(assignAppSchema),
    assignAppController
  );

  // Tenants
  app.post("/tenants", validateFields(tenantSchema), createTenantController);
  app.post("/tenants/:id/apps");
  app.delete("/tenants/:tenantId/users/userId");
  app.get("/tenants", getTenantsController);
  app.get("/tenants/:id");
  app.put("/tenants/:id");

  Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT,
  });
  console.info(`Servidor corriendo en el puerto: ${process.env.PORT}`);
};

serve();
