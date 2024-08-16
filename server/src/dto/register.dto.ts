import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateRegisterDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
