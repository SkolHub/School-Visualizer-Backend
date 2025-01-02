import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { NotificationService } from '../notification/notification.service';

function nextDay(x: number) {
  const now = new Date();

  now.setDate(now.getDate() + ((x + (7 - now.getDay())) % 7));

  return now;
}

@Injectable()
export class TimetableService extends DBService {
  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  async create(createTimetableDto: CreateTimetableDto) {
    await this.notificationService.clearNotifications(this.token);

    const raw_notifications = createTimetableDto.subjects.flatMap((subject) =>
      subject.timeSlots.map((timeSlot) => {
        return {
          deviceToken: this.token,
          displayName: subject.displayName,
          color: subject.color,
          symbolName: subject.symbolName,
          repeatAfter: 7,
          startTime: new Date(timeSlot.startTime),
          endTime: new Date(timeSlot.endTime),
          weekday: timeSlot.weekday
        };
      })
    );

    for (let i = 1; i <= 7; i++) {
      const notifications = raw_notifications
        .filter((el) => el.weekday === i)
        .sort((a, b) => {
          const startTimeA = new Date(a.startTime);
          const startTimeB = new Date(b.startTime);

          return Number(startTimeA) - Number(startTimeB);
        });

      for (let j = 0; j < notifications.length; j++) {
        const now = new Date();

        const startTime = new Date(
          nextDay(i).setHours(
            notifications[j].startTime.getHours(),
            notifications[j].startTime.getMinutes(),
            notifications[j].startTime.getSeconds(),
            0
          )
        );

        const endTime = new Date(
          nextDay(i).setHours(
            notifications[j].endTime.getHours(),
            notifications[j].endTime.getMinutes(),
            notifications[j].endTime.getSeconds(),
            0
          )
        );

        const delay = startTime.getTime() - now.getTime();

        await this.notificationService.scheduleBeginHour(
          this.token,
          {
            displayName: notifications[j].displayName,
            color: notifications[j].color,
            symbolName: notifications[j].symbolName,
            endTime: endTime,
            nextTimeSlot:
              j !== notifications.length - 1
                ? {
                  displayName: notifications[j + 1].displayName,
                  color: notifications[j + 1].color,
                  symbolName: notifications[j + 1].symbolName
                }
                : null,
            startTime: null
          },
          delay
        );

        const nextNotification = notifications[j + 1];

        const endDelay = endTime.getTime() - now.getTime();

        if (nextNotification) {
          await this.notificationService.scheduleNextHour(
            this.token,
            {
              displayName: notifications[j + 1].displayName,
              color: notifications[j + 1].color,
              symbolName: notifications[j + 1].symbolName,
              startTime: new Date(
                nextDay(i).setHours(
                  notifications[j + 1].startTime.getHours(),
                  notifications[j + 1].startTime.getMinutes(),
                  notifications[j + 1].startTime.getSeconds(),
                  0
                )
              ),
              endTime: null,
              nextTimeSlot: null
            },
            endDelay
          );
        } else {
          await this.notificationService.scheduleEndActivity(
            this.token,
            endDelay
          );
        }
      }
    }
  }

  async delete() {
    await this.notificationService.clearNotifications(this.token);
  }
}
