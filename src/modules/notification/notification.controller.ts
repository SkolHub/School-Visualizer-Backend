import { Controller, Delete, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  test() {
    return this.notificationService.getNotifications();
  }

  @Delete()
  delete() {
    return this.notificationService.deleteNotifications();
  }
}
