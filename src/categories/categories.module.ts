import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryModel, CategorySchema } from 'src/models/category.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CategoryModel.name,
        schema: CategorySchema
      }
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})

export class CategoriesModule { }