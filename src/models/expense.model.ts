import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId} from 'mongoose';
import { IExpense } from './interfaces/expense.interface';

@Schema({ collection: 'expenses', timestamps: true })
export class ExpenseModel extends Document implements IExpense {
  _id: ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  billId: string;

  @Prop({ required: true })
  categoryId: string;

  @Prop({ required: true, type: Date, default: Date.now })
  date: Date;

  @Prop({ required: true })
  value: number;

  @Prop({ required: false })
  description: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(ExpenseModel);
