import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillsModule } from 'src/bills/bills.module';
import { IncomesModule } from 'src/incomes/incomes.module';
import { ClearService } from './clear.service';
import { ClearController } from './clear.controller';
import { ExpensesModule } from 'src/expenses/expenses.module';


@Module({
  imports: [
    BillsModule,
    IncomesModule,
    ExpensesModule,
  ],
  controllers: [ClearController],
  providers: [ClearService],
})

export class ClearModule { }