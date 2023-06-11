import { IsString,IsNotEmpty } from "class-validator"

export class GetExpensesDto {
  @IsString()
  @IsNotEmpty()
  date: string;
}