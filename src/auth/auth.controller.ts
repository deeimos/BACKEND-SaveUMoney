import { Body, Controller, HttpStatus, HttpException, Post, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';

import { CreateUserDto } from './dto/createUser.dto';
import { RegGuard } from './guards/createUser.guard';
import { CreateUserStatus } from './interfaces/createUserStatus.interface';
import { LoginUserStatus } from './interfaces/loginUserStatus.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  // @UsePipes(new ValidationPipe()) ---------------> раскоментировать
  @UseGuards(RegGuard) // перенести логику на frontend
  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const createUser: CreateUserStatus = await this.authService.createUser(createUserDto);
    if (!createUser.success) {
      throw new HttpException(createUser.message, HttpStatus.BAD_REQUEST);
    }

    res.send(createUser);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ) {
    const status: LoginUserStatus = await this.authService.loginUser(loginUserDto);
    res.status(HttpStatus.OK).send(status);
  }
}