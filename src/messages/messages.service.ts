import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SocketService } from 'src/socket/socket.service';
import { MessageDto } from '../shared/dto/messages.dto';
import { MessageUpdateDto } from './dto/messages.update.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly socketService: SocketService
  ) {}

  async create(message: MessageDto) {
    const createdMessage = await this.databaseService.message.create({
      data: message,
    });
    
    this.socketService.handleSendMessage(createdMessage);

    return createdMessage;
  }

  async findMany(chatId: number) {
    return await this.databaseService.message.findMany({
      where: { chat_id: chatId },
    });
  }

  async update(messageId: number, changes: MessageUpdateDto) {
    return await this.databaseService.message.update({
      where: {
        id: messageId,
        type: "text",
      },
      data: changes
    })
  }

  async delete(messageId: number) {
    const deletedMessage = await this.databaseService.message.delete({
      where: {
        id: messageId,
      }
    });

    this.socketService.handleDeleteMessage(deletedMessage.id);

    return deletedMessage;
  }
}
