import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/users/users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { RegGuard } from './guards/createUser.guard';
import { CreateUserStatus } from './interfaces/createUserStatus.interface';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) { }

  @UseGuards(RegGuard)
  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    let status: CreateUserStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      await this.userService.createUser(createUserDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }

    return res.send(status);
  }
}