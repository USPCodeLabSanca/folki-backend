-- CreateTable
CREATE TABLE "institute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "campusId" INTEGER NOT NULL,

    CONSTRAINT "institute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "institute_name_key" ON "institute"("name");

-- AddForeignKey
ALTER TABLE "institute" ADD CONSTRAINT "institute_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
