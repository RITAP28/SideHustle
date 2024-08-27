/*
  Warnings:

  - Added the required column `path` to the `WebDevFolder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WebDevFolder" ADD COLUMN     "path" TEXT NOT NULL;
