/*
  Warnings:

  - Added the required column `type` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('EXAM', 'HOMEWORK', 'ACTIVITY', 'LIST');

-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "type" "ActivityType" NOT NULL,
ALTER COLUMN "value" DROP NOT NULL;
