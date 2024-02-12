/*
  Warnings:

  - Made the column `userId` on table `user_absence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subjectId` on table `user_absence` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "user_absence" DROP CONSTRAINT "user_absence_userId_subjectId_fkey";

-- AlterTable
ALTER TABLE "user_absence" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "subjectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "user_absence" ADD CONSTRAINT "user_absence_userId_subjectId_fkey" FOREIGN KEY ("userId", "subjectId") REFERENCES "user_subject"("userId", "subjectId") ON DELETE RESTRICT ON UPDATE CASCADE;
