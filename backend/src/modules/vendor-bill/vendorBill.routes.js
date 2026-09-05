import { Router } from "express";

import { VendorBillController } from "./vendorBill.controller.js";

const vendorBillRoute = Router();

vendorBillRoute.post("/", VendorBillController.createVendorBill);
vendorBillRoute.get("/", VendorBillController.getVendorBills);
vendorBillRoute.get("/:id", VendorBillController.getVendorBillById);
vendorBillRoute.patch("/:id", VendorBillController.updateVendorBill);
vendorBillRoute.patch("/:id/archive", VendorBillController.archiveVendorBill);

export default vendorBillRoute;
