/*
  Warnings:

  - Added the required column `name` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('FOLDER', 'FILE');

-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'FILE';

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'FOLDER';
