import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { IUser } from './interfaces/user.interface';

@Schema({ collection: 'users', timestamps: true })
export class UserModel extends Document implements IUser {
	_id: ObjectId;

	@Prop({ required: true })
	username: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	email: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
