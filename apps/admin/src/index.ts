import { Hono } from "hono";
import {
  appById,
  assignAppController,
  categoriesController,
  createAppController,
  createParamController,
  createReportController,
  createTenantController,
  deleteParamController,
  deleteReportController,
  getAllAppsController,
  getAllCategoriesController,
  getAllReportsController,
  getAllTenantsController,
  getAppsAssigned,
  getAppsByUserTenantController,
  getAppsController,
  getCategoriesController,
  getParamsByReport,
  getParamsController,
  getReportsController,
  getTenantsController,
  modifyReportController,
  removeUserAppController,
  updateAppController,
  usersByAppsController,
} from "./controllers";
import { registerLog, validateFields, verifyToken } from "@lumina/middlewares";
import {
  appsSchema,
  assignAppSchema,
  categorySchema,
  paramReportSchema,
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
  app.get("/apps/all", getAllAppsController);
  app.get("/apps/:id", appById);
  app.get("/apps/:appId/tenant/:tenantId/users", usersByAppsController);
  app.put("/apps/:id", updateAppController);
  app.get("/apps/user/:id", getAppsAssigned);
  app.get("/apps/user/:id/tenant/:tenantId", getAppsByUserTenantController);
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
  app.get("/tenants/all", getAllTenantsController);
  app.get("/tenants", getTenantsController);
  app.get("/tenants/:id");
  app.put("/tenants/:id");

  // Reports
  app.post("/reports", validateFields(reportSchema), createReportController);
  app.get("/reports", getReportsController);
  app.get("/reports/all", getAllReportsController);
  app.put("/reports/:id", validateFields(reportSchema), modifyReportController);
  app.delete("/reports/:id", deleteReportController);

  // Params Reports
  app.post("/params", validateFields(paramReportSchema), createParamController);
  app.get("/params/reports/:id", getParamsByReport);
  app.get("/params", getParamsController);
  app.delete("/params/:id", deleteParamController);

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
