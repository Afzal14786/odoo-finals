ALTER TABLE "vendor_bills"
ADD COLUMN "due_date" date;

UPDATE "vendor_bills"
SET "due_date" = "bill_date" + INTERVAL '30 days'
WHERE "due_date" IS NULL;

ALTER TABLE "vendor_bills"
ALTER COLUMN "due_date" SET NOT NULL;