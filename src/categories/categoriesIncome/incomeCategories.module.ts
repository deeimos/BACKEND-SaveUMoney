import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IncomesCategoriesController } from './incomeCategories.controller';
import { IncomesCategoriesService } from './incomeCategories.service';
import { IncomeCategoryModel, IncomeCategorySchema } from 'src/models/incomeCategory.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: IncomeCategoryModel.name,
        schema: IncomeCategorySchema
      }
    ]),
  ],
  controllers: [IncomesCategoriesController],
  providers: [IncomesCategoriesService],
})

export class IncomeCategoriesModule { }