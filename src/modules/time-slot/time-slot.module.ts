import { Module } from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import { TimeSlotController } from './time-slot.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [TimeSlotController],
  providers: [TimeSlotService]
})
export class TimeSlotModule {}
