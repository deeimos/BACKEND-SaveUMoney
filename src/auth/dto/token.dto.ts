import { IsString, IsNotEmpty}from "class-validator"

export class JwtDto{
  @IsNotEmpty()
  @IsNotEmpty()
  token: string;
}