import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { UserModel } from 'src/models/user.model';
import { isEmail } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) { }

  async validateUserEmail(email: string): Promise<boolean> {
    const user = await this.userService.findOne(email);
    if (!user && isEmail(email)) return Promise.resolve(true);
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
}