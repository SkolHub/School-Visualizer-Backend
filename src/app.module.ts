import { Module } from '@nestjs/common';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { AppRoutesModule } from './config/app-routes.module';
import { DatabaseModule } from './config/database.module';
import { SubjectModule } from './modules/subject/subject.module';
import { TimeSlotModule } from './modules/time-slot/time-slot.module';
import { LocalStorageModule } from './config/local-storage.module';
import { APP_GUARD } from '@nestjs/core';
import { DeviceTokenGuard } from './guards/device-token.guard';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    AppRoutesModule,
    DatabaseModule,
    LocalStorageModule,
    ScheduleModule,
    SubjectModule,
    TimeSlotModule,
    NotificationModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: DeviceTokenGuard
    }
  ]
})
export class AppModule {}
