import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ChatsDto } from 'src/shared/dto/chats.create.dto';
@Injectable()
export class ChatsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(chatData: ChatsDto) {
    const { participant_one_id, participant_two_id } = chatData;

    const duplicate = await this.findDuplicateChat(participant_one_id, participant_two_id);

    if (duplicate) return duplicate;

    return await this.databaseService.chat.create({
      data: chatData,
    });
  }

  async findChat(chatId: number) {
    const chat = await this.databaseService.chat.findFirst({
      where: { id: chatId },
      select: {
        id: true,
        participant_one: {
          omit: { password: true },
        },
        participant_two: {
          omit: { password: true },
        },
        messages: {
          orderBy: {
            created_at: 'desc',
          },
          include: {
            parent_message: {
              include: {
                sender: {
                  omit: { password: true },
                }
              }
            }
          }
        },
      },
    });

    return chat;
  }

  async findDuplicateChat(userOneId: number, userTwoId: number) {
    return await this.databaseService.chat.findFirst({
      where: {
        OR: [
          { participant_one_id: userOneId, participant_two_id: userTwoId },
          { participant_one_id: userTwoId, participant_two_id: userOneId }
        ]
      }
    });
  }

  async findChatsByUserID(userId: number) {
    return await this.databaseService.chat.findMany({
      where: { 
        OR: [
          { participant_one_id: userId },
          { participant_two_id: userId },
        ]
      },
      select: {
        id: true,
        participant_one: {
          omit: { password: true },
        },
        participant_two: {
          omit: { password: true },
        }
      }
    });
  }

  async delete(chatId: number) {
    return await this.databaseService.chat.delete({
      where: { id: chatId },
    });
  }
}
