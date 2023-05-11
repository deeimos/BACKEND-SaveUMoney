import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId} from 'mongoose';
import { ICost } from './interfaces/cost.interface';

@Schema({ collection: 'costs', timestamps: true })
export class CostModel extends Document implements ICost {
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

export const CostSchema = SchemaFactory.createForClass(CostModel);
