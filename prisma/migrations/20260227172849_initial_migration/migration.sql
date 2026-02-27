-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'audio', 'video');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refresh_token" (
    "id" BIGSERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "Refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" BIGSERIAL NOT NULL,
    "participant_one_id" BIGINT NOT NULL,
    "participant_two_id" BIGINT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" BIGSERIAL NOT NULL,
    "type" "MessageType" NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "chat_id" BIGINT NOT NULL,
    "sender_id" BIGINT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Refresh_token_token_key" ON "Refresh_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Refresh_token_user_id_key" ON "Refresh_token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_participant_one_id_participant_two_id_key" ON "Chat"("participant_one_id", "participant_two_id");

-- AddForeignKey
ALTER TABLE "Refresh_token" ADD CONSTRAINT "Refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participant_one_id_fkey" FOREIGN KEY ("participant_one_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participant_two_id_fkey" FOREIGN KEY ("participant_two_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
