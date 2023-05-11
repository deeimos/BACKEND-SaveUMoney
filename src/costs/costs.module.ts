import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CostsController } from './costs.controller';
import { CostsService } from './costs.service';
import { CostModel, CostSchema } from 'src/models/cost.model';
import { BillsModule } from 'src/bills/bills.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CostModel.name,
        schema: CostSchema
      },
    ]),
    BillsModule,
  ],
  controllers: [CostsController],
  providers: [CostsService],
})

export class CostsModule { }