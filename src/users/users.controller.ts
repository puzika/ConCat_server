import { 
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  Param,
  Delete,
  ParseIntPipe
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserCreateDto } from './dto/users.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('users')
export class UserController {
  constructor (private readonly userService: UserService) {}

  @Post()
  async create(@Body(ZodValidationPipe) user: UserCreateDto) {
    return await this.userService.create(user);
  }

  @Get()
  async findMany(@Query('search') query: string) {
    if (query) return await this.userService.findManySearch(query);

    return [];
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe) userId: number) {
    return await this.userService.findManyParticipants(userId);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body(ZodValidationPipe) updates: UserUpdateDto) {
    return await this.userService.update(id, updates);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id);
  }
}
