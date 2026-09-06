import { Router } from "express";

import authRoute from "../modules/auth/auth.routes.js";

import contactRoute from "../modules/contact/contact.routes.js";
import productRoute from "../modules/product/product.routes.js";

import chartOfAccountRoute from "../modules/chart-of-account/chartOfAccount.routes.js";
import journalRoute from "../modules/journal/journal.routes.js";
import journalEntryRoute from "../modules/journal-entry/journalEntry.routes.js";

import analyticAccountRoute from "../modules/analytic-account/analyticAccount.routes.js";
import budgetRoute from "../modules/budget/budget.routes.js";

import purchaseOrderRoute from "../modules/purchase-order/purchaseOrder.routes.js";
import vendorBillRoute from "../modules/vendor-bill/vendorBill.routes.js";
import purchasePaymentRoute from "../modules/purchase-payment/purchasePayment.routes.js";

import salesOrder from "../modules/sales-order/salesOrder.routes.js";
import customerInvoiceRoute from "../modules/customer-invoice/customerInvoice.routes.js";
import customerPaymentRoute from "../modules/customer-payment/customerPayment.routes.js";

import stockManagementRoute from "../modules/stock-management/stockManagement.routes.js";
import stockReportsRoute from "../modules/stock-reports/stockReports.routes.js";

import profitLossRoute from "../modules/profit-loss/profitLoss.routes.js";
import balanceSheetRoute from "../modules/balance-sheet/balanceSheet.route.js";
import budgetReportRoute from "../modules/budget/budgetReport.route.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { authorize } from "../middlewares/authorize.middleware.js";

const route = Router();

route.use("/auth", authRoute);

route.use("/contacts", authenticate, contactRoute);

route.use("/products", authenticate, productRoute);

route.use(
  "/coa",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  chartOfAccountRoute,
);

route.use(
  "/journals",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  journalRoute,
);

route.use(
  "/journal-entries",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  journalEntryRoute,
);

route.use(
  "/analytic-accounts",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  analyticAccountRoute,
);

route.use(
  "/budgets",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  budgetRoute,
);

route.use("/purchase-orders", authenticate, purchaseOrderRoute);

route.use(
  "/vendor-bills",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  vendorBillRoute,
);

route.use(
  "/purchase-payments",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  purchasePaymentRoute,
);

route.use("/sales-orders", authenticate, salesOrder);

route.use(
  "/customer-invoices",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  customerInvoiceRoute,
);

route.use(
  "/customer-payments",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  customerPaymentRoute,
);


route.use(
  "/stock-movements",
  authenticate,
  authorize("ADMIN", "STAFF"),
  stockManagementRoute,
);


route.use("/stock-reports", authenticate, stockReportsRoute);

route.use(
  "/reports/profit-loss",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  profitLossRoute,
);

route.use(
  "/reports/balance-sheet",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  balanceSheetRoute,
);

route.use(
  "/reports/budget",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  budgetReportRoute,
);

export default route;
