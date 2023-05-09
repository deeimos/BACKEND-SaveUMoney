import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IBill } from './interfaces/bill.interface';

@Schema({ collection: 'bills', timestamps: true })
export class BillModel extends Document implements IBill{
	_id: mongoose.Types.ObjectId;

	@Prop({ required: true })
	userId: string;

	@Prop({ required: true })
  name: string;

	@Prop({ required: true })
  value: number;

  @Prop({ required: false })
  description: string;
}

export const BillSchema = SchemaFactory.createForClass(BillModel);
