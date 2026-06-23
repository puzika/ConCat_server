import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { DatabaseModule } from 'src/database/database.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  imports: [DatabaseModule, SocketModule]
})
export class ChatsModule {}
