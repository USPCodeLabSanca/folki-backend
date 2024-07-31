/*
  Warnings:

  - You are about to drop the column `instituteId` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `jupiterCode` on the `course` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_instituteId_fkey";

-- DropIndex
DROP INDEX "course_jupiterCode_key";

-- AlterTable
ALTER TABLE "course" DROP COLUMN "instituteId",
DROP COLUMN "jupiterCode";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "instituteId" INTEGER;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "institute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
