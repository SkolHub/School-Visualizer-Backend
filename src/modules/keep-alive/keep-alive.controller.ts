import { Controller, Get } from '@nestjs/common';
import { KeepAliveService } from './keep-alive.service';
import { Public } from '../../common/public.decorator';

@Controller()
export class KeepAliveController {
  constructor(private readonly keepAliveService: KeepAliveService) {}

  @Public()
  @Get()
  ping() {
    return this.keepAliveService.ping();
  }
}
