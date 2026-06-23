import { 
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ChatsService } from './chats.service';
import { SocketService } from 'src/socket/socket.service';
import { ChatsDto } from 'src/shared/dto/chats.create.dto';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly socketService: SocketService
  ) {}

  @Post()
  async create(@Body(ZodValidationPipe) chatData: ChatsDto) {
    const chat = await this.chatsService.create(chatData);
    this.socketService.handleCreateChat(chat);
    return chat;
  }

  @Get()
  async findChatsByUserId(@Query('user', ParseIntPipe) userId: number) {
    if (userId) return await this.chatsService.findChatsByUserID(userId);

    return [];
  }

  @Get(':id')
  async findChat(@Param('id', ParseIntPipe) id: number) {
    return await this.chatsService.findChat(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.chatsService.delete(id);
  }
}
