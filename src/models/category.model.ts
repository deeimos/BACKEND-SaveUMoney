import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { ICategory } from './interfaces/category.interface';

@Schema({ collection: 'categories', timestamps: true })
export class CategoryModel extends Document implements ICategory{
	_id: ObjectId;

	@Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryModel);
