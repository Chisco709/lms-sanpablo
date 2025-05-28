-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "pensumTopicId" TEXT,
ADD COLUMN     "unlockDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PensumTopic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PensumTopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PensumTopic_courseId_idx" ON "PensumTopic"("courseId");

-- CreateIndex
CREATE INDEX "Chapter_pensumTopicId_idx" ON "Chapter"("pensumTopicId");
