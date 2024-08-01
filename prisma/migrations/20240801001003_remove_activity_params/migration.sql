/*
  Warnings:

  - You are about to drop the column `completed` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `userValue` on the `activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activity" DROP COLUMN "completed",
DROP COLUMN "completedAt",
DROP COLUMN "userValue";
