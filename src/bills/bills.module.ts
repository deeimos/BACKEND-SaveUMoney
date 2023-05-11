import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { BillModel, BillSchema } from 'src/models/bill.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BillModel.name,
        schema: BillSchema
      }
    ]),
  ],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService],
})

export class BillModule { }