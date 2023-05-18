import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { IncomeCategoryModel } from 'src/models/incomeCategory.model';
import { CategoryDto } from '../dto/category.dto';

@Injectable()
export class IncomesCategoriesService {
  constructor(
    @InjectModel(IncomeCategoryModel.name)
    private incomeCategoryModel: Model<IncomeCategoryModel>,
  ) { }

  async findOneCategory(id: string) {
    return await this.incomeCategoryModel.findOne({ '_id': id }).exec();
  }

  async findAllCategories() {
    return await this.incomeCategoryModel.find().exec();
  }

  async findCategoryName({ name }: CategoryDto){
    return await this.incomeCategoryModel.findOne({ 'name': name }).exec();
  }

  async createCategory(categoryDto: CategoryDto) {
    const category = await this.findCategoryName(categoryDto);
    if (category){
      throw new HttpException('Category already exists', HttpStatus.BAD_REQUEST);
    }
    const createdCategory = new this.incomeCategoryModel(categoryDto);
    return await createdCategory.save()
  }

  async updateCategory(id: string, categoryDto: CategoryDto) {
    const category = await this.findCategoryName(categoryDto);
    if (category){
      throw new HttpException('Category with this name already exists', HttpStatus.BAD_REQUEST);
    }
    await this.incomeCategoryModel.updateOne(
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
    return await this.incomeCategoryModel.deleteOne({ _id: id });
  }
}