import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ExpenseCategoryModel } from 'src/models/expenseCategory.model';
import { CategoryDto } from '../dto/category.dto';

@Injectable()
export class ExpensesCategoriesService {
  constructor(
    @InjectModel(ExpenseCategoryModel.name)
    private expenseCategoryModel: Model<ExpenseCategoryModel>,
  ) { }

  async findOneCategory(id: string) {
    return await this.expenseCategoryModel.findOne({ '_id': id }).exec();
  }

  async findAllCategories() {
    return await this.expenseCategoryModel.find().exec();
  }

  async findCategoryName({ name }: CategoryDto){
    return await this.expenseCategoryModel.findOne({ 'name': name }).exec();
  }

  async createCategory(categoryDto: CategoryDto) {
    const category = await this.findCategoryName(categoryDto);
    if (category){
      throw new HttpException('Category already exists', HttpStatus.BAD_REQUEST);
    }
    const createdCategory = new this.expenseCategoryModel(categoryDto);
    return await createdCategory.save()
  }

  async updateCategory(id: string, categoryDto: CategoryDto) {
    const category = await this.findCategoryName(categoryDto);
    if (category){
      throw new HttpException('Category with this name already exists', HttpStatus.BAD_REQUEST);
    }
    await this.expenseCategoryModel.updateOne(
      { _id: id },
      {
        $set: {
          ...categoryDto
        },
      },
    );

    return this.findOneCategory(id);
  }

  async deleteCategory(id: string) {
    return await this.expenseCategoryModel.deleteOne({ _id: id });
  }
}