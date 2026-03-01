/*
  Warnings:

  - Added the required column `modified_at` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");
