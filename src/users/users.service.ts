import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserCreateDto } from './dto/users.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(user: UserCreateDto) {
    return await this.databaseService.user.create({
      data: user,
    })
  }

  async findManySearch(query: string) {
    return await this.databaseService.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' }, },
          { username: { contains: query, mode: 'insensitive' }, }
        ]
      }
    });
  }

  async findManyParticipants(userId: number) {
    return await this.databaseService.$queryRaw`
      SELECT
        u.id AS "userId",
        u.username AS "username",
        c.id AS "chatId"
      FROM
        "User" AS u
      INNER JOIN
        "Chat" AS c
      ON(
        (c.participant_one_id = u.id AND c.participant_two_id = ${userId}) OR
        (c.participant_one_id = ${userId} AND c.participant_two_id = u.id)
      );
    `;
  }

  async update(id: number, updates: UserUpdateDto) {
    return await this.databaseService.user.update({
      where: { id },
      data: updates,
    })
  }

  async delete(id: number) {
    return await this.databaseService.user.delete({
      where: { id },
    })
  }
}
