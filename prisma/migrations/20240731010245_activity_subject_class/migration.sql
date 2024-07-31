/*
  Warnings:

  - You are about to drop the column `subjectId` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `userSubjectId` on the `activity` table. All the data in the column will be lost.
  - Added the required column `subjectClassId` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_userSubjectId_fkey";

-- AlterTable
ALTER TABLE "activity" DROP COLUMN "subjectId",
DROP COLUMN "userSubjectId",
ADD COLUMN     "subjectClassId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_subjectClassId_fkey" FOREIGN KEY ("subjectClassId") REFERENCES "subject_class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
