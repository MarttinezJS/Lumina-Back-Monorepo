import { Hono } from "hono";
import {
  assignUserTenantSchema,
  changePassSchema,
  loginSchema,
  menuSchema,
  reportUserSchema,
  updateUserSchema,
  userMenuSchema,
  userSchema,
} from "./schemas";
import {
  checkToken,
  createMenu,
  createUser,
  login,
  getMenuController,
  assignMenuUsersController,
  treeMenuController,
  buildSidebarController,
  createFirstUser,
  getTenantsController,
  updateMenuController,
  updateUserController,
  changePassController,
  authorizedController,
  getAllUsers,
  getUserById,
  assignTenantController,
  getUserApps,
  logout,
  getTenantByUserController,
  deleteUserTenantController,
  getReportsAssignController,
  deleteReportUserController,
  assignReportController,
} from "./controllers";
import { registerLog, validateFields, verifyToken } from "@lumina/middlewares";
import { initJwk, setBoundData } from "@lumina/security";
const serve = async () => {
  const app = new Hono();

  await initJwk();
  setBoundData();
  app.on(
    ["GET", "POST", "DELETE", "PUT"],
    ["/users/*", "/menus/*"],
    registerLog,
  );

  app.use("*", (c, next) => {
    console.info(`${c.req.path} | ${c.req.method}`);
    return next();
  });

  // Usuarios
  app.use("/users/*", verifyToken);
  app.post("/users/menu");
  app.post("/users", validateFields(userSchema), createUser);
  app.get("/users/:id/tenants", getTenantByUserController);
  app.delete("/users/:userId/tenants/:tenantId", deleteUserTenantController);
  app.post(
    "/users/:id/tenants",
    validateFields(assignUserTenantSchema),
    assignTenantController,
  );
  app.put("/users/:id", validateFields(updateUserSchema), updateUserController);
  app.get("/users", getAllUsers);
  app.post(
    "/users/assign-menu",
    validateFields(userMenuSchema),
    assignMenuUsersController,
  );
  app.put(
    "/users/:id/change-password",
    validateFields(changePassSchema),
    changePassController,
  );
  app.get("/users/:id", getUserById);
  app.get("/users/:id/authorize", authorizedController);
  app.get("/users/:id/apps", getUserApps);
  app.post(
    "/users/assign-report",
    validateFields(reportUserSchema),
    assignReportController,
  );
  app.delete("/users/:userId/report/:reportId", deleteReportUserController);
  app.get("/users/:id/reports", getReportsAssignController);

  // Menus
  app.use("/menus/*", verifyToken);
  app.post("/menus", validateFields(menuSchema), createMenu);
  app.put("/menus/:id", validateFields(menuSchema), updateMenuController);
  app.get("/menus", getMenuController);
  app.get("/menus/user/:userId/app/:appName/sidebar", buildSidebarController);
  app.get("/menus/user/:userId/app/:appId/tree", treeMenuController);

  app.get("/token", checkToken);
  app.post("/login", validateFields(loginSchema), login);
  app.post("/logout", logout);
  app.post("/8B7HMzd49AqIyo", validateFields(userSchema), createFirstUser);

  app.get("/:username/tenants", getTenantsController);

  Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT,
  });
  console.info(`Servidor corriendo en el puerto: ${process.env.PORT}`);
};

serve();
