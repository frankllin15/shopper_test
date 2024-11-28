/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `value` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "createdAt",
DROP COLUMN "price",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;
