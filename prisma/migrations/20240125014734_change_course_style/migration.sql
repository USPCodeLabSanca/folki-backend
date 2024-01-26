/*
  Warnings:

  - You are about to drop the `institute_course` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `instituteId` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "institute_course" DROP CONSTRAINT "institute_course_courseId_fkey";

-- DropForeignKey
ALTER TABLE "institute_course" DROP CONSTRAINT "institute_course_instituteId_fkey";

-- DropIndex
DROP INDEX "course_name_key";

-- AlterTable
ALTER TABLE "course" ADD COLUMN     "instituteId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "institute_course";

-- CreateTable
CREATE TABLE "subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "instituteId" INTEGER NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "default_subject" (
    "subjectId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,

    CONSTRAINT "default_subject_pkey" PRIMARY KEY ("subjectId","courseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "subject_code_key" ON "subject"("code");

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "default_subject" ADD CONSTRAINT "default_subject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "default_subject" ADD CONSTRAINT "default_subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
