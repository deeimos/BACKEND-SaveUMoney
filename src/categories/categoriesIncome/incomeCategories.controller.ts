import { Body, Controller, UseGuards, HttpCode, HttpStatus, Req, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomesCategoriesService } from './incomeCategories.service';
import { CategoryDto } from '../dto/category.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('income-categories')
export class IncomesCategoriesController {
  constructor(
    private readonly incomesCategoriesService: IncomesCategoriesService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOneCategory(@Param('id') id: string) {
    return await this.incomesCategoriesService.findOneCategory(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getCategories(@Req() req: any) {
    return await this.incomesCategoriesService.findAllCategories();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCategory(@Req() req: any, @Body() categoryDto: CategoryDto) {
    return await this.incomesCategoriesService.createCategory(categoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateCategory(@Param('id') id: string, @Body() categoryDto: CategoryDto) {
    return await this.incomesCategoriesService.updateCategory(id, categoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    const deleted = await this.incomesCategoriesService.deleteCategory(id);
    if (deleted.deletedCount) return { "Expense category deleted": deleted.deletedCount };
  }
}