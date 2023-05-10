import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { CategoryModel } from 'src/models/category.model';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategoryModel.name)
    private categoryModel: Model<CategoryModel>,
  ) { }

  async createCategory(categoryDto: CategoryDto){
    const createdCategory = new this.categoryModel(categoryDto);
    return await createdCategory.save()
  }

  async findOneCategory(id: string) {
    return await this.categoryModel.findOne({ '_id': id }).exec();
  }

  async findAllCategories() {
    return await this.categoryModel.find().exec();
  }

  async updateCategory(id: string, categoryDto: CategoryDto) {
    await this.categoryModel.updateOne(
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
    return await this.categoryModel.deleteOne({ _id: id });
  }
}