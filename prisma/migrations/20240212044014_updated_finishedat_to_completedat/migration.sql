/*
  Warnings:

  - You are about to drop the column `finishedAt` on the `activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activity" DROP COLUMN "finishedAt",
ADD COLUMN     "completedAt" TIMESTAMP(3);
