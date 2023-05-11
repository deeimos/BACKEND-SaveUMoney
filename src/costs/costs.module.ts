import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CostController } from './costs.controller';
import { CostService } from './costs.service';
import { CostModel, CostSchema } from 'src/models/cost.model';
import { BillModule } from 'src/bills/bills.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CostModel.name,
        schema: CostSchema
      },
    ]),
    BillModule,
  ],
  controllers: [CostController],
  providers: [CostService],
})

export class CostsModule { }