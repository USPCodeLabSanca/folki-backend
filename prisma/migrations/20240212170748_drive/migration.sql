-- AlterTable
ALTER TABLE "subject" ADD COLUMN     "driveItemsNumber" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "drive_item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "drive_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "drive_item" ADD CONSTRAINT "drive_item_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
