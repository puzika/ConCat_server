import { 
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { ZodValidationPipe } from 'nestjs-zod';
import { ParseIntPipe } from '@nestjs/common';
import { MessageDto } from 'src/shared/dto/messages.dto';
import type { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: "*" }})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() 
  server!: Server;
  
  handleConnection(client: Socket) {
    console.log("User ", client.id, "connected");
  }

  handleDisconnect(client: Socket) {
    console.log("User ", client.id, "disconnected");
  }

  handleSendMessage(@MessageBody(ZodValidationPipe) message: MessageDto) {
    this.server.emit('message:received', message);
  }

  handleDeleteMessage(@MessageBody(ParseIntPipe) messageId: number) {
    this.server.emit('message:deleted', messageId);
  }

  @SubscribeMessage('join chat')
  handleJoinChat(@MessageBody() chatId: number, @ConnectedSocket() client: Socket) {
    const chatRoomName = `room_${chatId}`;
    client.join(chatRoomName);
    console.log(`User ${client.id} join chat ${chatRoomName} `);
  }
}
