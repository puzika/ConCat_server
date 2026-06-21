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
import { ParseIntPipe, UnauthorizedException } from '@nestjs/common';
import { MessageDto } from 'src/shared/dto/messages.dto';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { type JwtPayload } from 'src/auth/types';
import type { Socket, Server } from 'socket.io';
import * as cookie from 'cookie';
import z from 'zod';

@WebSocketGateway({ 
  cors: { 
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private onlineUsers: Map<number, Set<string>> = new Map();

  constructor (
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService
  ){}

  private async extractUserId(client: Socket) {
    const rawCookie = client.handshake.headers.cookie;

    if (!rawCookie) {
      client.disconnect();
      throw new UnauthorizedException('Access unauthorized');
    }

    const parsedData = z.object({ 
      Access: z.string(), 
      Refresh: z.string().nullable().optional() 
    }).safeParse(cookie.parse(rawCookie));

    if (!parsedData.success) {
      client.disconnect();
      throw new UnauthorizedException('Invalid token');
    }

    const { Access } = parsedData.data;
    const { sub } = this.jwtService.decode(Access) as JwtPayload;

    return sub;
  }
  
  async handleConnection(client: Socket) {
    console.log("User ", client.id, "connected");
    
    const sub = await this.extractUserId(client);
    client.data.userId = sub;

    if (!this.onlineUsers.has(sub)) {
      this.onlineUsers.set(sub, new Set());
      this.server.emit(`status:updated:${sub}`, { isOnline: true });

      await this.databaseService.user.update({
        where: { id: sub },
        data: { is_online: true },
      });
    }

    const socketConnections = this.onlineUsers.get(sub);
    socketConnections?.add(client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log("User ", client.id, "disconnected");

    const sub = client.data.userId as number;
    const socketConnections = this.onlineUsers.get(sub);

    if (!socketConnections || socketConnections.size === 0) return;

    socketConnections.delete(client.id);

    if (socketConnections.size === 0) {
      this.onlineUsers.delete(sub);
      this.server.emit(`status:updated:${sub}`, { isOnline: false });

      await this.databaseService.user.update({
        where: { id: sub },
        data: { is_online: false },
      });
    }
  }

  handleSendMessage(@MessageBody(ZodValidationPipe) message: MessageDto) {
    this.server.emit('message:received', message);
  }

  handleUpdateMessage(@MessageBody(ZodValidationPipe) message: MessageDto) {
    this.server.emit('message:updated', message);
  }

  handleDeleteMessage(@MessageBody(ParseIntPipe) messageId: number) {
    this.server.emit('message:deleted', messageId);
  }
}
