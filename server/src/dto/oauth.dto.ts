import { IsString } from 'class-validator';

export class CreateOauthDto {
  @IsString()
  accessToken: string;
}
