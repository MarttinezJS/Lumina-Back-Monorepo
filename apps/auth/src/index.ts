import { Hono } from "hono";
import {
  changePassSchema,
  loginSchema,
  menuSchema,
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
} from "./controllers";
import { registerLog, validateFields } from "./middlewares";
import { initJwk } from "./config";
import { setBoundData } from "./services";
import { verifyToken } from "./middlewares";
import { openPrisma, PrismaClient } from "@lumina/prisma";
const serve = async () => {
  const app = new Hono();

  // await initJwk();
  // setBoundData();
  // // initTenants();
  app.on(
    ["GET", "POST", "DELETE", "PUT"],
    ["/users/*", "/menus/*"],
    registerLog
  );

  app.use("*", (c, next) => {
    console.info(`${c.req.path} | ${c.req.method}`);
    return next();
  });

  // // Usuarios
  // app.use("/users/*", verifyToken);
  app.post("/users/menu");
  app.post("/users", validateFields(userSchema), createUser);
  app.put("/users/:id", validateFields(updateUserSchema), updateUserController);
  app.get("/users", getAllUsers);
  app.put(
    "/users/:id/change-password",
    validateFields(changePassSchema),
    changePassController
  );
  app.get("/users/:id", getUserById);
  app.get("/users/:id/authorize", authorizedController);
  app.get("/users/:id/menus", treeMenuController);
  app.get("/users/:id/menus/sidebar", buildSidebarController);
  app.post(
    "/users/:id/menus",
    validateFields(userMenuSchema),
    assignMenuUsersController
  );

  // Menus
  // app.use("/menus/*", verifyToken);
  app.post("/menus", validateFields(menuSchema), createMenu);
  app.put("/menus/:id", validateFields(menuSchema), updateMenuController);
  app.get("/menus", getMenuController);

  app.get("/token", checkToken);
  app.post("/login", validateFields(loginSchema), login);
  app.post("/8B7HMzd49AqIyo", validateFields(userSchema), createFirstUser);

  app.get("/tenants", getTenantsController);

  Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT,
  });
  console.info(`Servidor corriendo en el puerto: ${process.env.PORT}`);
};

serve();
