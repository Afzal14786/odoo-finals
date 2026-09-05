import { Router } from "express";
import authRoute  from "../modules/auth/auth.routes.js";
import contactRoute  from "../modules/contact/contact.routes.js";
import productRoute  from "../modules/product/product.routes.js";
import chartOfAccountRoute from "../modules/chart-of-account/chartOfAccount.routes.js"
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

const route = Router();

analyticAccountRoute
route.use("/auth", authRoute);
route.use("/contacts", contactRoute);
route.use("/products", productRoute);
route.use("/coa", chartOfAccountRoute);  // coa stands for chart-of-account samjhe kia
route.use("/journals", journalRoute);
route.use("/journal-entries", journalEntryRoute);
route.use("/analytic-accounts", analyticAccountRoute);
route.use("/budgets", budgetRoute);
route.use("/purchase-orders", purchaseOrderRoute);
route.use("/purchase-payments", purchasePaymentRoute);
route.use("/vendor-bills", vendorBillRoute);
route.use("/sales-orders", salesOrder);
route.use("/customer-invoices", customerInvoiceRoute);
route.use("/customer-payments", customerPaymentRoute);

export default route;