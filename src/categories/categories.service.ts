import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
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

  async findOneCategory(id: string) {
    return await this.categoryModel.findOne({ '_id': id }).exec();
  }

  async findAllCategories() {
    return await this.categoryModel.find().exec();
  }

  async findCategoryName({ name }: CategoryDto){
    return await this.categoryModel.findOne({ 'name': name }).exec();
  }

  async createCategory(categoryDto: CategoryDto) {
    const category = await this.findCategoryName(categoryDto);
    if (category){
      throw new HttpException('Category already exists', HttpStatus.BAD_REQUEST);
    }
    const createdCategory = new this.categoryModel(categoryDto);
    return await createdCategory.save()
  }

  async updateCategory(id: string, categoryDto: CategoryDto) {
    const category = await this.findCategoryName(categoryDto);
    if (category){
      throw new HttpException('Category with this name already exists', HttpStatus.BAD_REQUEST);
    }
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