import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ICategory } from './interfaces/category.interface';

@Schema({ collection: 'categories', timestamps: true })
export class CategoryModel extends Document implements ICategory{
	_id: mongoose.Types.ObjectId;

	@Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryModel);
