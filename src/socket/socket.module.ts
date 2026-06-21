import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [SocketService],
  exports: [SocketService],
  imports: [JwtModule.register({}), DatabaseModule],
})
export class SocketModule {}
