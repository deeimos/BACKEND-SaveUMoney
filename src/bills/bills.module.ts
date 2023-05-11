import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
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
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService],
})

export class BillsModule { }