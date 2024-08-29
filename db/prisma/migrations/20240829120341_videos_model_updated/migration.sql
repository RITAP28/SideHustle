/*
  Warnings:

  - You are about to drop the column `link` on the `Videos` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Videos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[videoLink]` on the table `Videos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdAt` to the `Videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `Videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailLink` to the `Videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoLink` to the `Videos` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Videos_link_key";

-- AlterTable
ALTER TABLE "Videos" DROP COLUMN "link",
DROP COLUMN "thumbnail",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "thumbnailLink" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "videoLink" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Videos_videoLink_key" ON "Videos"("videoLink");
