/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `university` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `logo` to the `university` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `university` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "university" ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "university_slug_key" ON "university"("slug");
