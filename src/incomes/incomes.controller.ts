import { Body, Controller, UseGuards, HttpCode, HttpStatus, Req, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/createIncome.dto';
import { UpdateIncomeDto } from './dto/updateIncome.dto';
import { GetIncomesDto } from './dto/getIncomes.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('incomes')
export class IncomesController {
  constructor(
    private readonly incomesService: IncomesService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOneIncome(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id;
    return await this.incomesService.findOneIncome(id, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async getIncomes(@Req() req: any,  @Body() getIncomesDto: GetIncomesDto) {
    const userId = req.user._id;
    return await this.incomesService.findAllIncomes(userId, getIncomesDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/total')
  async getTotalIncomes(@Req() req: any,  @Body() getIncomesDto: GetIncomesDto) {
    const userId = req.user._id;
    return await this.incomesService.totalIncomes(userId, getIncomesDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/stats')
  async getStatIncomes(@Req() req: any,  @Body() getIncomesDto: GetIncomesDto) {
    const userId = req.user._id;
    return await this.incomesService.statIncomes(userId, getIncomesDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createIncome(@Req() req: any, @Body() createIncomeDto: CreateIncomeDto) {
    const userId = req.user._id;
    return await this.incomesService.createIncome({ ...createIncomeDto, userId });
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateIncome(@Param('id') id: string, @Req() req: any, @Body() updateIncomeDto: UpdateIncomeDto) {
    const userId = req.user._id;
    return await this.incomesService.updateIncome(id, userId, updateIncomeDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteExpense(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id;
    const deleted = await this.incomesService.deleteIncome(id, userId);
    if (deleted.deletedCount) return { "incomes deleted": deleted.deletedCount };
  }
}