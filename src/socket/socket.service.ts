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
import { NewMessageDto } from './dto/socket.newmsg.dto';
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

  @SubscribeMessage('new message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    
  }

  @SubscribeMessage('join chat')
  handleJoinChat(@MessageBody() chatId: number, @ConnectedSocket() client: Socket) {
    const chatRoomName = `room_${chatId}`;
    client.join(chatRoomName);
    console.log(`User ${client.id} join chat ${chatRoomName} `);
  }
}
