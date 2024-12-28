import { Module } from '@nestjs/common';
import { KeepAliveService } from './keep-alive.service';
import { HttpModule } from '@nestjs/axios';
import { KeepAliveController } from './keep-alive.controller';

@Module({
  controllers: [KeepAliveController],
  imports: [HttpModule],
  providers: [KeepAliveService]
})
export class KeepAliveModule {}
