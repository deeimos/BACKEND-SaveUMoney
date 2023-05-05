import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { UserModel, UserSchema } from 'src/models/user.model';
import { genSalt, hash, compare} from 'bcrypt';
import { LoginUserDto } from 'src/auth/dto/loginUser.dto';
import { toUserDto } from 'src/shared/mapper';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private usersModel: Model<UserModel>,
  ) { }

  async findOne(email: string): Promise<UserDto> {
    const user = await this.usersModel.findOne({ email }).exec();
    return toUserDto(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto | null> {
    const { username, password, email } = createUserDto;
    const isExists = await this.usersModel.findOne({ email }).exec();
    if (isExists){
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    const createdUser = new this.usersModel({
      username,
      password: hashPassword,
      email,
    });
    const user = await createdUser.save();
    if (!user) return null;

    return toUserDto(user);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserDto | null> {
    const { email, password } = loginUserDto;
    const user = await this.usersModel.findOne({ email }).exec();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return toUserDto(user);
  }
}