import {IsString, IsNotEmpty, IsEmail} from "class-validator"

export class UserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}