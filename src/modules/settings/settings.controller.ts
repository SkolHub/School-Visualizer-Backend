import { Controller, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PauseDto } from './dto/pause.dto';

@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Patch('pause')
  pause(pauseDto: PauseDto) {
    return this.settingsService.pause(pauseDto);
  }

  @Patch('unpause')
  unpause() {
    return this.settingsService.unpause();
  }
}
