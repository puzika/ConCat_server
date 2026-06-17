import { 
  Controller,
  Get,
  Patch,
  Body,
  Query,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserUpdateDto } from './dto/user.update.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { GetCurrentUser } from 'src/common/decorators';

@Controller('users')
export class UserController {
  constructor (private readonly userService: UserService) {}

  @Get('me') 
  async findUnique(@GetCurrentUser('sub') userId: number) {
    return await this.userService.findUnique(userId);
  }

  @Get('find')
  async findMany(
    @GetCurrentUser('sub') userId: number,
    @Query('search') query: string,
  ) {
    if (query) return await this.userService.findManySearch(query, userId);

    return [];
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
