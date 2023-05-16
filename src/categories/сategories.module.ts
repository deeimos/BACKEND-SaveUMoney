import { Module } from '@nestjs/common';

import { ExpenseCategoriesModule } from './categoriesExpense/expenseCategories.module';
import { IncomeCategoriesModule } from './categoriesIncome/incomeCategories.module';

@Module({
  imports: [
    ExpenseCategoriesModule,
    IncomeCategoriesModule,
  ],
})

export class CategoriesModule { }