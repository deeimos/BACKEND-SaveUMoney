import { Body, Controller, UseGuards, HttpCode, HttpStatus, Req, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpensesCategoriesService } from './expenseCategories.service';
import { CategoryDto } from '../dto/category.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('expense-categories')
export class ExpensesCategoriesController {
  constructor(
    private readonly expensesCategoriesService: ExpensesCategoriesService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOneCategory(@Param('id') id: string) {
    return await this.expensesCategoriesService.findOneCategory(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getCategories(@Req() req: any) {
    return await this.expensesCategoriesService.findAllCategories();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCategory(@Req() req: any, @Body() categoryDto: CategoryDto) {
    return await this.expensesCategoriesService.createCategory(categoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateCategory(@Param('id') id: string, @Body() categoryDto: CategoryDto) {
    return await this.expensesCategoriesService.updateCategory(id, categoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    const deleted = await this.expensesCategoriesService.deleteCategory(id);
    if (deleted.deletedCount) return { "Expense category deleted": deleted.deletedCount };
  }
}