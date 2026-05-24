/*
  Warnings:

  - A unique constraint covering the columns `[parent_message_id]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "parent_message_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Message_parent_message_id_key" ON "Message"("parent_message_id");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
