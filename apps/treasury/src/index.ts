import { Hono } from "hono";
import {
  balanceController,
  balanceYearController,
  createBudgetController,
  createConceptController,
  createEntryIssueController,
  createHeadingController,
  createIncome,
  createTransactionalIncome,
  deleteExpenseController,
  deleteIncomeController,
  deleteIssueController,
  downloadTemplateController,
  getAnnualIncomeController,
  getBudgetController,
  getBudgetExpensesController,
  getConceptController,
  getEntriesController,
  getExpensesController,
  getHeadingsController,
  getIdentificationsTypeController,
  getIncomesController,
  getSuppliersController,
  idTypesController,
  saveExpenseController,
  saveSuppliers,
  solveIssue,
  totalByHeading,
  updateConceptController,
  updateExpenseController,
  updateHeadingController,
  updateIdTypeController,
  updateIncomeController,
  updateSupplierController,
  uploadExpensesController,
  uploadIncome,
  verifyEntry,
} from "./controllers";
import {
  budgetSchema,
  conceptSchema,
  expensesSchema,
  headingSchema,
  idTypeSchema,
  incomeSchema,
  incomeTransactionalSchema,
  issueSchema,
  solveSchema,
  supplierSchema,
  verifySchema,
} from "./schemas";
import { registerLog, validateFields, verifyToken } from "@lumina/middlewares";
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

  // Metrics
  app.get("/metrics/balance/annual/:year", balanceYearController);
  app.get("/metrics/balance/:month/:year", balanceController);
  app.get("/metrics/headings/:month/:year", totalByHeading);

  // Income
  app.post("/incomes/upload", uploadIncome);
  app.get("/incomes/annual", getAnnualIncomeController);
  app.get("/incomes/template", downloadTemplateController);
  app.post("/incomes", validateFields(incomeSchema), createIncome);
  app.put("/incomes/:id", validateFields(incomeSchema), updateIncomeController);
  app.post(
    "/incomes/transactional",
    validateFields(incomeTransactionalSchema),
    createTransactionalIncome
  );
  app.get("/incomes", getIncomesController);
  app.delete("/incomes/:id", deleteIncomeController);

  // Expenses
  app.post("/expenses", validateFields(expensesSchema), saveExpenseController);
  app.put(
    "/expenses/:id",
    validateFields(expensesSchema),
    updateExpenseController
  );
  app.get("/expenses", getExpensesController);
  app.post("/expenses/upload", uploadExpensesController);
  app.delete("/expenses/:id", deleteExpenseController);

  // Supplier
  app.post("/suppliers", validateFields(supplierSchema), saveSuppliers);
  app.put(
    "/suppliers/:id",
    validateFields(supplierSchema),
    updateSupplierController
  );
  app.get("/suppliers", getSuppliersController);

  // Concepts
  app.post("/concepts", validateFields(conceptSchema), createConceptController);
  app.put(
    "/concepts/:id",
    validateFields(conceptSchema),
    updateConceptController
  );
  app.get("/concepts", getConceptController);

  // Heading
  app.post("/heading", validateFields(headingSchema), createHeadingController);
  app.put(
    "/heading/:id",
    validateFields(headingSchema),
    updateHeadingController
  );
  app.get("/heading", getHeadingsController);

  // Identification Type
  app.get("/identification-types", getIdentificationsTypeController);
  app.post(
    "/identification-types",
    validateFields(idTypeSchema),
    idTypesController
  );
  app.put(
    "/identification-types/:id",
    validateFields(idTypeSchema),
    updateIdTypeController
  );

  // Entry issues
  app.post(
    "/entry-issues",
    validateFields(issueSchema),
    createEntryIssueController
  );
  app.get("/entry-issues", getEntriesController);
  app.delete("/entry-issues/:id", deleteIssueController);
  app.patch("/entry-issues/verify", validateFields(verifySchema), verifyEntry);
  app.patch("/entry-issues/solve", validateFields(solveSchema), solveIssue);

  // Budget
  app.post("/budget", validateFields(budgetSchema), createBudgetController);
  app.get("/budget", getBudgetController);
  app.get("/budget/expenses", getBudgetExpensesController);
  Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT,
  });
  console.info(`Servidor corriendo en el puerto: ${process.env.PORT}`);
};

serve();
