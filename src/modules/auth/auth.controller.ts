import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UploadTokenDto } from './dto/upload-token.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('device-token')
  deviceToken(@Body() uploadTokenDto: UploadTokenDto) {
    return this.authService.deviceToken(uploadTokenDto);
  }

  @Post('start-token')
  startToken(@Body() uploadTokenDto: UploadTokenDto) {
    return this.authService.startToken(uploadTokenDto);
  }
}
