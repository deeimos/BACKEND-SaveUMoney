import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';

import { UsersService } from 'src/users/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserStatus } from './interfaces/createUserStatus.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { LoginUserStatus } from './interfaces/loginUserStatus.interface';
import { IJwtPayload } from './interfaces/payload.interface';
import { getJwtConstants } from './const';
import { UserModel } from 'src/models/user.model';
import { JwtDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
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
      await this.usersService.createUser(createUserDto);
    } catch (err) {
      status = {
        success: false,
        message: err.message,
      };
    }
    return status;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginUserStatus> {
    const user = await this.usersService.loginUser(loginUserDto);
    const token = this._createToken(user);

    const status: LoginUserStatus = {
      email: user.email,
      username: user.username,
      ...token,
    }
    return status;
  }

  async validateUser(payload: IJwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload.email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async getUser({ token }: JwtDto) {
    if (!this.jwtService.verify(token)) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const decodedToken = this.jwtService.decode(token);
    if (decodedToken instanceof Object && 'email' in decodedToken && 'username' in decodedToken) {
      const user: IJwtPayload = { email: decodedToken.email, username: decodedToken.username }
      const expiresIn = getJwtConstants().expiresIn;
      const accessToken = this.jwtService.sign(user);
      return {
        expiresIn,
        accessToken,
      };
    } else {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  private _createToken({ email, username }: UserDto): any {
    const expiresIn = getJwtConstants().expiresIn;
    const user: IJwtPayload = { email, username };
    const accessToken = this.jwtService.sign(user);

    return {
      expiresIn,
      accessToken,
    };
  }
}