import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  test() {
    console.log('mircea');
    return this.notificationService.sendNotification('', 'test sau text', {});
  }
}
