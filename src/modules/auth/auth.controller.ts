import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UploadTokenDto } from './dto/upload-token.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('start-token')
  startToken(@Body() uploadTokenDto: UploadTokenDto) {
    return this.authService.startToken(uploadTokenDto);
  }

  @Post('update-token')
  updateToken(@Body() uploadTokenDto: UploadTokenDto) {
    return this.authService.updateToken(uploadTokenDto);
  }
}
