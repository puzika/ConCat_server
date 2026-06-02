-- DropIndex
DROP INDEX "Refresh_token_user_id_key";

-- AlterTable
ALTER TABLE "Refresh_token" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
