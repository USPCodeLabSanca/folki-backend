/*
  Warnings:

  - The primary key for the `user_subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userSubjectId` to the `activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userSubjectId` to the `user_absence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_userId_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "user_absence" DROP CONSTRAINT "user_absence_userId_subjectId_fkey";

-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "userSubjectId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_absence" ADD COLUMN     "userSubjectId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_subject" DROP CONSTRAINT "user_subject_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_subject_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "user_absence" ADD CONSTRAINT "user_absence_userSubjectId_fkey" FOREIGN KEY ("userSubjectId") REFERENCES "user_subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_userSubjectId_fkey" FOREIGN KEY ("userSubjectId") REFERENCES "user_subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
