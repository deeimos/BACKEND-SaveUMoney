import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';
import { IncomeModel, IncomeSchema } from 'src/models/income.model';
import { BillsModule } from 'src/bills/bills.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: IncomeModel.name,
        schema: IncomeSchema
      },
    ]),
    BillsModule,
  ],
  controllers: [IncomesController],
  providers: [IncomesService],
})

export class IncomesModule { }