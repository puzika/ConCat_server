/*
  Warnings:

  - A unique constraint covering the columns `[client_id]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "client_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Message_client_id_key" ON "Message"("client_id");
