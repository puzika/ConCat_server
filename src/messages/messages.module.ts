import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [DatabaseModule],
})
export class MessagesModule {}
