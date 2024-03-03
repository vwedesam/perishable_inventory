-- CreateIndex
CREATE INDEX "idx_item_name" ON "inventoryItems"("name");

-- CreateIndex
CREATE INDEX "idx_lot_expiry" ON "lots"("expiry");
