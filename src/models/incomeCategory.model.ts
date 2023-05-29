import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { ICategory } from './interfaces/category.interface';

@Schema({ collection: 'incomeCategories', timestamps: true })
export class IncomeCategoryModel extends Document implements ICategory{
	_id: ObjectId;

	@Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const IncomeCategorySchema = SchemaFactory.createForClass(IncomeCategoryModel);
