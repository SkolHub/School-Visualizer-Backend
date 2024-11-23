import { Controller } from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';

@Controller('time-slot')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}
}
