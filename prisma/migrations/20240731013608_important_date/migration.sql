-- CreateEnum
CREATE TYPE "ImportDateType" AS ENUM ('DAY_OFF', 'GENERAL');

-- CreateTable
CREATE TABLE "important_date" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "ImportDateType" NOT NULL,

    CONSTRAINT "important_date_pkey" PRIMARY KEY ("id")
);
