import { IsString } from 'class-validator';

export class UploadTokenDto {
  @IsString()
  token: string;
}
