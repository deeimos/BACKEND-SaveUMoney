import { IsString, IsNumber, IsNotEmpty, IsDate } from "class-validator"

export class CreateCostDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  billId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  description: string;
}