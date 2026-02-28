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
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('user')
export class UserController {
  constructor (private readonly userService: UserService) {}

  @Post()
  async create(@Body(ZodValidationPipe) user: UserCreateDto) {
    return await this.userService.create(user);
  }

  @Get()
  async findMany(@Query('search') query: string) {
    return await this.userService.findMany(query);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body(ZodValidationPipe) updates: UserUpdateDto) {
    return await this.userService.update(id, updates);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
