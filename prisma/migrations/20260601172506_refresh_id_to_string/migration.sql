/*
  Warnings:

  - The primary key for the `Refresh_token` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Refresh_token" DROP CONSTRAINT "Refresh_token_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Refresh_token_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Refresh_token_id_seq";
