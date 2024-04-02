-- CreateTable
CREATE TABLE "inventoryItems" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventoryItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lots" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "itemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventoryItems_name_key" ON "inventoryItems"("name");

-- CreateIndex
CREATE INDEX "idx_item_name" ON "inventoryItems"("name");

-- CreateIndex
CREATE INDEX "idx_lot_itemId" ON "lots"("itemId");

-- CreateIndex
CREATE INDEX "idx_lot_expiry" ON "lots"("expiry");

-- CreateIndex
CREATE INDEX "idx_lot_expiry_quantity" ON "lots"("expiry", "quantity");

-- AddForeignKey
ALTER TABLE "lots" ADD CONSTRAINT "lots_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventoryItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
