import { IsString, IsNotEmpty, IsEmail } from "class-validator"

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}