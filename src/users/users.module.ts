import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/models/user.model';
import { UserService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name, 
        schema: UserSchema
      }
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule { };