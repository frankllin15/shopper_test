/*
  Warnings:

  - A unique constraint covering the columns `[destination,origin]` on the table `CalculatedRoute` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CalculatedRoute_destination_origin_key" ON "CalculatedRoute"("destination", "origin");
