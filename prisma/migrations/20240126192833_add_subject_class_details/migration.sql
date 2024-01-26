/*
  Warnings:

  - Added the required column `details` to the `subject_class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subject_class" ADD COLUMN     "details" TEXT NOT NULL;
