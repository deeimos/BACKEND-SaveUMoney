import {IsString, IsNumber, IsNotEmpty} from "class-validator"

export class CreateBillDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    value: number;

    @IsNotEmpty()
    @IsString()
    description: string;
}