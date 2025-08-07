/*
  Warnings:

  - You are about to drop the column `pdfUrl` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Chapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "pdfUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "pdfUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "pdf_url" TEXT,
ADD COLUMN     "videoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "video_url" TEXT;
