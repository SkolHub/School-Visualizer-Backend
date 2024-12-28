import { Module } from '@nestjs/common';
import { TimetableModule } from './modules/timetable/timetable.module';
import { AppRoutesModule } from './config/app-routes.module';
import { DatabaseModule } from './config/database.module';
import { LocalStorageModule } from './config/local-storage.module';
import { APP_GUARD } from '@nestjs/core';
import { DeviceTokenGuard } from './guards/device-token.guard';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { KeepAliveModule } from './modules/keep-alive/keep-alive.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    AppRoutesModule,
    DatabaseModule,
    LocalStorageModule,
    ScheduleModule.forRoot(),
    TimetableModule,
    AuthModule,
    KeepAliveModule,
    SettingsModule
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
