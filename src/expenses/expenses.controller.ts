import { Body, Controller, UseGuards, HttpCode, HttpStatus, Req, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/createExpense.dto';
import { UpdateExpenseDto } from './dto/updateExpense.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOneExpense(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id;
    return await this.expensesService.findOneExpense(id, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getExpenses(@Req() req: any) {
    const userId = req.user._id;
    return await this.expensesService.findAllExpenses(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createExpense(@Req() req: any, @Body() createExpenseDto: CreateExpenseDto) {
    const userId = req.user._id;
    return await this.expensesService.createExpense({ ...createExpenseDto, userId});
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateExpense(@Param('id') id: string, @Req() req: any, @Body() updateExpenseDto: UpdateExpenseDto) {
    const userId = req.user._id;
    return await this.expensesService.updateExpense(id, userId, updateExpenseDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteExpense(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id;
    const deleted = await this.expensesService.deleteExpense(id, userId);
    if (deleted.deletedCount) return { "expenses deleted": deleted.deletedCount };
  }
}