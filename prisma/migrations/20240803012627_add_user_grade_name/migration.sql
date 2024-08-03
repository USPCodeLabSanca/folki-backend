/*
  Warnings:

  - Added the required column `name` to the `grade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "grade" ADD COLUMN     "name" TEXT NOT NULL;
