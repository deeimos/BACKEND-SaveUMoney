import { Body, Controller, UseGuards, HttpCode, HttpStatus, Req, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOneCategory(@Param('id') id: string) {
    return await this.categoriesService.findOneCategory(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getCategories(@Req() req: any) {
    return await this.categoriesService.findAllCategories();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCategory(@Req() req: any, @Body() categoryDto: CategoryDto) {
    return await this.categoriesService.createCategory(categoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateCategory(@Param('id') id: string, @Body() categoryDto: CategoryDto) {
    return await this.categoriesService.updateCategory(id, categoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    const deleted = await this.categoriesService.deleteCategory(id);
    if (deleted.deletedCount) return { "Category deleted": deleted.deletedCount };
  }
}