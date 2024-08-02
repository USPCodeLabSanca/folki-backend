/*
  Warnings:

  - Added the required column `semester` to the `subject_class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `subject_class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subject_class" ADD COLUMN     "semester" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
