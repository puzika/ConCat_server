import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ChatsCreateDto } from './dto/chats.create.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(chatData: ChatsCreateDto) {
    const { participant_one_id, participant_two_id } = chatData;

    const duplicate = await this.databaseService.chat.findFirst({
      where: {
        OR: [
          { participant_one_id, participant_two_id },
          { participant_one_id: participant_two_id, participant_two_id: participant_one_id }
        ]
      }
    });

    if (duplicate) return duplicate;

    return await this.databaseService.chat.create({
      data: chatData
    });
  }

  async findMany(userId: number) {
    return await this.databaseService.chat.findMany({
      where: {
        OR: [
          { participant_one_id: userId },
          { participant_two_id: userId },
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
