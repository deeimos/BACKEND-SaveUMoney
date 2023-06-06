import { IsString,IsNotEmpty } from "class-validator"

export class GetIncomesDto {
  @IsString()
  @IsNotEmpty()
  date: string;
}