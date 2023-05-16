import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { ICategory } from './interfaces/category.interface';

@Schema({ collection: 'expenceCategories', timestamps: true })
export class ExpenseCategoryModel extends Document implements ICategory{
	_id: ObjectId;

	@Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const ExpenseCategorySchema = SchemaFactory.createForClass(ExpenseCategoryModel);
