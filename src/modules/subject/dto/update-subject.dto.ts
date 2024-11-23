import { IsString, Length } from 'class-validator';

export class UpdateSubjectDto {
  @IsString()
  @Length(1, 50)
  name: string;
}
