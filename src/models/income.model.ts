import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId} from 'mongoose';
import { IIncome } from './interfaces/income.interface';

@Schema({ collection: 'incomes', timestamps: true })
export class IncomeModel extends Document implements IIncome {
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

export const IncomeSchema = SchemaFactory.createForClass(IncomeModel);
