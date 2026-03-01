import { 
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { MessageCreateDto } from './dto/messages.create.dto';
import { MessageUpdateDto } from './dto/messages.update.dto';
import { MessagesService } from './messages.service';

@Controller('chats/:chatId/messages')
export class MessagesController {
  constructor (private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body(ZodValidationPipe) message: MessageCreateDto) {
    return await this.messagesService.create(message);
  }

  @Get()
  async findMany(@Param('chatId', ParseIntPipe) chatId: number) {
    return await this.messagesService.findMany(chatId);
  }

  @Patch(':messageId')
  async update(
    @Param("messageId", ParseIntPipe) messageId: number, 
    @Body(ZodValidationPipe) changes: MessageUpdateDto
  ) {
    return await this.messagesService.update(messageId, changes);
  }

  @Delete(':messageId')
  async delete(@Param("messageId", ParseIntPipe) messageId: number) {
    return await this.messagesService.delete(messageId);
  }
}
