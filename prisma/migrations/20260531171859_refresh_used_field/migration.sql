/*
  Warnings:

  - Added the required column `is_used` to the `Refresh_token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Message_parent_message_id_key";

-- AlterTable
ALTER TABLE "Refresh_token" ADD COLUMN     "is_used" BOOLEAN NOT NULL;
