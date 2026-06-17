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

  async findUnique(userId: number) {
    return await this.databaseService.user.findUnique({ where: { id: userId }});
  }

  async findManySearch(query: string, userId: number) {
    return await this.databaseService.user.findMany({
      where: {
        username: { contains: query, mode: 'insensitive' },
        NOT: {
          id: userId,
        }
      },
      omit: { password: true },
    });
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
