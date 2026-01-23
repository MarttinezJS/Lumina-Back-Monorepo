import { Hono } from "hono";
import {
  appById,
  assignAppController,
  categoriesController,
  createAppController,
  createReportController,
  createTenantController,
  getAllCategoriesController,
  getAppsAssigned,
  getAppsController,
  getCategoriesController,
  getReportsController,
  getTenantsController,
  removeUserAppController,
  updateAppController,
  usersByAppsController,
} from "./controllers";
import { registerLog, validateFields, verifyToken } from "@lumina/middlewares";
import {
  appsSchema,
  assignAppSchema,
  categorySchema,
  reportSchema,
  tenantSchema,
} from "./schemas";
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
    removeUserAppController,
  );
  app.post(
    "/apps/assign",
    validateFields(assignAppSchema),
    assignAppController,
  );

  // Tenants
  app.post("/tenants", validateFields(tenantSchema), createTenantController);
  app.post("/tenants/:id/apps");
  app.delete("/tenants/:tenantId/users/userId");
  app.get("/tenants", getTenantsController);
  app.get("/tenants/:id");
  app.put("/tenants/:id");

  // Reports
  app.post("/reports", validateFields(reportSchema), createReportController);
  app.get("/reports", getReportsController);

  // Categories
  app.post("/categories", validateFields(categorySchema), categoriesController);
  app.get("/categories", getCategoriesController);
  app.get("/categories/all", getAllCategoriesController);

  Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT,
  });
  console.info(`Servidor corriendo en el puerto: ${process.env.PORT}`);
};

serve();
