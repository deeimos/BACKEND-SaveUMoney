import { UserDto } from '../users/dto/user.dto';
import { UserModel } from 'src/models/user.model';
import { ObjectId } from 'mongoose';

export const toUserDto = (data: UserModel): UserDto => {
	if(!data) return null;
	const { _id, username, email } = data;

	const userDto: UserDto & { _id: ObjectId } = {
		_id,
		email,
		username
	};

	return userDto;
};