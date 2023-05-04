import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { UserModel, UserSchema } from 'src/models/user.model';
import { genSalt, hash } from 'bcrypt';
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

  async createUser(createUserDto: CreateUserDto): Promise<UserModel | null> {
    const { username, password, email } = createUserDto;
    const isExists = await this.usersModel.findOne({email});
    if (isExists) return null;

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    const createdUser = new this.usersModel({
      username,
      password: hashPassword,
      email,
    });
    return createdUser.save();
  }

  // async login({ email, password }: LoginUserDto): Promise<User | null> {
  //   const user = await this.usersModel.collection;
  // }
}