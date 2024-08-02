/*
  Warnings:

  - You are about to drop the column `jupiterCodeHab` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `jupiterCode` on the `institute` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `subject` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `subject_class` table. All the data in the column will be lost.
  - You are about to drop the column `professorName` on the `subject_class` table. All the data in the column will be lost.
  - You are about to drop the column `authTimesTried` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastAuthTry` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `availableDays` on the `user_subject` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `user_subject` table. All the data in the column will be lost.
  - You are about to drop the `default_subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_auth` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[jupiterCode]` on the table `course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subjectClassId` to the `user_subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "default_subject" DROP CONSTRAINT "default_subject_courseId_fkey";

-- DropForeignKey
ALTER TABLE "default_subject" DROP CONSTRAINT "default_subject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "subject" DROP CONSTRAINT "subject_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "user_auth" DROP CONSTRAINT "user_auth_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_subject" DROP CONSTRAINT "user_subject_subjectId_fkey";

-- AlterTable
ALTER TABLE "course" DROP COLUMN "jupiterCodeHab",
ALTER COLUMN "jupiterCode" DROP DEFAULT;

-- AlterTable
ALTER TABLE "institute" DROP COLUMN "jupiterCode";

-- AlterTable
ALTER TABLE "subject" DROP COLUMN "instituteId",
ADD COLUMN     "content" TEXT;

-- AlterTable
ALTER TABLE "subject_class" DROP COLUMN "details",
DROP COLUMN "professorName";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "authTimesTried",
DROP COLUMN "instituteId",
DROP COLUMN "isVerified",
DROP COLUMN "lastAuthTry";

-- AlterTable
ALTER TABLE "user_subject" DROP COLUMN "availableDays",
DROP COLUMN "subjectId",
ADD COLUMN     "subjectClassId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "default_subject";

-- DropTable
DROP TABLE "user_auth";

-- CreateIndex
CREATE UNIQUE INDEX "course_jupiterCode_key" ON "course"("jupiterCode");

-- AddForeignKey
ALTER TABLE "user_subject" ADD CONSTRAINT "user_subject_subjectClassId_fkey" FOREIGN KEY ("subjectClassId") REFERENCES "subject_class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
