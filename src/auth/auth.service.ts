import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';

import { UserService } from 'src/users/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserStatus } from './interfaces/createUserStatus.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { LoginUserStatus } from './interfaces/loginUserStatus.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { getJwtConstants } from './const';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  // ---------------------------------------------------------------------------------------------------
  async validateUserEmail(email: string): Promise<boolean> {
    if (isEmail(email)) return Promise.resolve(true);
    return Promise.resolve(false);
  }

  validateUserName(username: string): Promise<boolean> {
    if (username.length <= 2) return Promise.resolve(false);
    return Promise.resolve(true);
  }

  validatePassword(password: string): Promise<Boolean> {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/;
    if (!strongRegex.test(password) || password.length < 8) return Promise.resolve(false);
    return Promise.resolve(true);
  }
  // ---------------------------------------------------------------------------------------------------

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserStatus> {
    let status: CreateUserStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      await this.userService.createUser(createUserDto);
    } catch (err) {
      status = {
        success: false,
        message: err.message,
      };
    }
    return status;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginUserStatus> {
    const user = await this.userService.loginUser(loginUserDto);
    const token = this._createToken(user);

    const status: LoginUserStatus = {
      email: user.email,
      ...token,
    }
    return status;
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.userService.findByPayload(payload.email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ email }: UserDto): any {
    const expiresIn = getJwtConstants().expiresIn;
    const user: JwtPayload = { email };
    const accessToken = this.jwtService.sign(user);

    return {
      expiresIn,
      accessToken,
    };
  }
}