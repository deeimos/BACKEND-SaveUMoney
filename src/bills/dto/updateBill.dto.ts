import {IsString, IsNumber, IsNotEmpty} from "class-validator"

export class UpdateBillDto {
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