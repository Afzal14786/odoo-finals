import { Router } from "express";

import { CustomerInvoiceController } from "./customerInvoice.controller.js";

const customerInvoiceRoute = Router();

customerInvoiceRoute.post("/", CustomerInvoiceController.createCustomerInvoice);

customerInvoiceRoute.get("/", CustomerInvoiceController.getCustomerInvoices);

customerInvoiceRoute.get(
  "/:id",
  CustomerInvoiceController.getCustomerInvoiceById,
);

customerInvoiceRoute.patch(
  "/:id",
  CustomerInvoiceController.updateCustomerInvoice,
);

customerInvoiceRoute.patch(
  "/:id/archive",
  CustomerInvoiceController.archiveCustomerInvoice,
);

export default customerInvoiceRoute;
