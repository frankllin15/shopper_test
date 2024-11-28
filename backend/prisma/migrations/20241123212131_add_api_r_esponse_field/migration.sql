/*
  Warnings:

  - Added the required column `apiResponse` to the `CalculatedRoute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CalculatedRoute" ADD COLUMN     "apiResponse" TEXT NOT NULL;
