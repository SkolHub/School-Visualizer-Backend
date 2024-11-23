import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly scheduleService: NotificationService) {}

  @Get()
  test() {
    console.log('mircea');
    return this.scheduleService.sendNotification('', 'test sau text', {});
  }
}
