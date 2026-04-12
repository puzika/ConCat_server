import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [UserModule, ChatsModule, MessagesModule, SocketModule],
})
export class AppModule {}
