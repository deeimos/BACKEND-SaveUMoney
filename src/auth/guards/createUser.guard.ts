import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';


// здесь возможна ошибка
@Injectable()
export class RegGuard implements CanActivate {
  constructor(private authService: AuthService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, username, password } = request.body;

    if (!email || !username || !password) {
      throw new UnauthorizedException('Отсутствуют обязательные поля');
    }

    const isCorrectEmail = await this.authService.validateUserEmail(email);
    if (!isCorrectEmail) {
      throw new UnauthorizedException("Некорректный адрес электронной почты")
    }

    const isCorrectName = await this.authService.validateUserName(username);
    if (!isCorrectName) {
      throw new UnauthorizedException(`Имя должно иметь более 2 символов`)
    }

    const isStrongPassword = await this.authService.validatePassword(password);
    if (!isStrongPassword) {
      throw new UnauthorizedException("Пароль должен иметь хотя бы одну букву высокого регистра," +
      "хотя бы одну буквумаленького регистра, хотя бы одну цифру и хотя бы один специальный символ и" +
      "длиной не менее 8 символов");
    }

    return true;
  }
}