/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `group_link` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tag` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_absence` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_auth` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_subject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "group_link" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "tag" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "user_absence" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "user_auth" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "user_subject" DROP COLUMN "updatedAt";
