/*
  Warnings:

  - You are about to drop the column `editAt` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "editAt",
ADD COLUMN     "editedAt" TIMESTAMP(3);
