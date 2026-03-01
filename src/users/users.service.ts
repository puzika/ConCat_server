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
        u.id,
        u.username
      FROM
        "User" AS u
      INNER JOIN
        "Chat" AS c
      ON
        (c.participant_one_id = ${userId} OR c.participant_two_id = ${userId}) AND (u.id <> ${userId})
      ;
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
