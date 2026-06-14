-- DropForeignKey
ALTER TABLE "Refresh_token" DROP CONSTRAINT "Refresh_token_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Refresh_token" ADD CONSTRAINT "Refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
