import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ChatsCreateDto } from './dto/chats.create.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(chatData: ChatsCreateDto) {
    const { participant_one_id, participant_two_id } = chatData;

    const duplicate = await this.findChat(participant_one_id, participant_two_id);

    if (duplicate) return duplicate;

    return await this.databaseService.chat.create({
      data: chatData,
    });
  }

  async findChat(userOneId: number, userTwoId: number) {
    return await this.databaseService.chat.findFirst({
      where: {
        OR: [
          { participant_one_id: userOneId, participant_two_id: userTwoId },
          { participant_one_id: userTwoId, participant_two_id: userOneId }
        ]
      }
    });
  }

  async delete(chatId: number) {
    return await this.databaseService.chat.delete({
      where: { id: chatId },
    });
  }
}
