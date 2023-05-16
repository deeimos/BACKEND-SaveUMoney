import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExpensesCategoriesController } from './expenseCategories.controller';
import { ExpensesCategoriesService } from './expenseCategories.service';
import { ExpenseCategoryModel, ExpenseCategorySchema } from 'src/models/expenseCategory.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ExpenseCategoryModel.name,
        schema: ExpenseCategorySchema
      }
    ]),
  ],
  controllers: [ExpensesCategoriesController],
  providers: [ExpensesCategoriesService],
})

export class ExpenseCategoriesModule { }