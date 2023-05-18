import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// import { ExpensesController } from './expenses.controller';
// import { ExpensesService } from './expenses.service';
import { ExpenseModel, ExpenseSchema } from 'src/models/expense.model';
import { BillsModule } from 'src/bills/bills.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ExpenseModel.name,
        schema: ExpenseSchema
      },
    ]),
    BillsModule,
  ],
  // controllers: [ExpensesController],
  // providers: [ExpensesService],
})

export class ExpensesModule { }