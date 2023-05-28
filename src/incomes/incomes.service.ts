import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { IncomeModel } from 'src/models/income.model';
import { CreateIncomeDto } from './dto/createIncome.dto';
import { UpdateIncomeDto } from './dto/updateIncome.dto';
import { BillsService } from 'src/bills/bills.service';
import { UpdateBillDto } from 'src/bills/dto/updateBill.dto';
import { CategoryDto } from 'src/categories/dto/category.dto';
import { IncomesCategoriesService } from 'src/categories/incomes/incomeCategories.service';
import { checkDate } from 'src/shared/checkDate';

@Injectable()
export class IncomesService {
  constructor(
    @InjectModel(IncomeModel.name)
    private incomeModel: Model<IncomeModel>,
    private billsService: BillsService,
    private incomesCategoriesService: IncomesCategoriesService,
  ) { }

  async findOneIncome(id: string, userId: string) {
    const income = await this.incomeModel.findOne({ '_id': id }).exec();

    if (!income)
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);

    if (userId.toString() !== income.userId)
      throw new HttpException('Access error', HttpStatus.NOT_ACCEPTABLE);

    return income;
  }

  async findBillIncomes(billId: any) {
    return await this.incomeModel.find().where('billId').in(billId).exec();
  }

  async findAllIncomes(userId: any) {
    return await this.incomeModel.find().where('userId').in(userId).exec();
  }

  async createIncome(createIncomeDto: CreateIncomeDto) {
    const categories = await this.incomesCategoriesService.findAllCategories();
    const bill = await this.billsService.findOneBill(createIncomeDto.billId, createIncomeDto.userId);

    switch (true) {
      case (createIncomeDto.userId.toString() !== bill.userId):
        throw new HttpException('Access error', HttpStatus.NOT_ACCEPTABLE);

      case (createIncomeDto.value <= 0):
        throw new HttpException('Income must be greater than 0', HttpStatus.BAD_REQUEST);

      case (!categories.some((category) => String(category._id) === createIncomeDto.categoryId)):
        throw new HttpException('Invalid categoryId', HttpStatus.BAD_REQUEST);

      default:
        const date = checkDate(createIncomeDto.date.toString());
        if (!date)
          throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST);
        console.log(date);

        createIncomeDto.date = date;
        console.log(createIncomeDto.date);
        bill.value = bill.value + createIncomeDto.value;
    }

    const createdIncome = new this.incomeModel(createIncomeDto);
    await this.billsService.updateBill(createIncomeDto.billId, createIncomeDto.userId, bill);
    return await createdIncome.save();
  }

  async updateIncome(id: string, userId: string, updateIncomeDto: UpdateIncomeDto) {
    const oldIncome: UpdateIncomeDto = await this.findOneIncome(id, userId);
    const categories = await this.incomesCategoriesService.findAllCategories();

    if (!updateIncomeDto.categoryId)
      updateIncomeDto.categoryId = oldIncome.categoryId;
    if (!updateIncomeDto.value && updateIncomeDto.value !== 0)
      updateIncomeDto.value = oldIncome.value;
    if (!updateIncomeDto.billId)
      updateIncomeDto.billId = oldIncome.billId;
    const bill = await this.billsService.findOneBill(updateIncomeDto.billId, userId);

    switch (true) {
      case (userId.toString() !== bill.userId):
        throw new HttpException('Access error', HttpStatus.NOT_ACCEPTABLE);

      case (!categories.some((category) => String(category._id) === updateIncomeDto.categoryId)):
        throw new HttpException('Invalid categoryId', HttpStatus.BAD_REQUEST);

      case (updateIncomeDto.value <= 0):
        throw new HttpException('income must be greater than 0', HttpStatus.BAD_REQUEST);

      case (updateIncomeDto.billId !== oldIncome.billId):
        const oldBill: UpdateBillDto = await this.billsService.findOneBill(oldIncome.billId, userId);
        oldBill.value = oldBill.value + oldIncome.value;
        console.log(oldIncome, oldBill);
        await this.billsService.updateBill(oldIncome.billId, userId, oldBill);
        bill.value = bill.value + oldIncome.value;

      default:
        bill.value = bill.value - oldIncome.value + updateIncomeDto.value;
    }

    await this.billsService.updateBill(updateIncomeDto.billId, userId, bill);
    await this.incomeModel.updateOne(
      { _id: id },
      {
        $set: {
          ...updateIncomeDto
        },
      },
    );

    return await this.findOneIncome(id, userId);
  }


  async deleteIncome(id: string, userId: string) {
    const income: UpdateIncomeDto = await this.findOneIncome(id, userId);
    const bill = await this.billsService.findOneBill(income.billId, userId);

    bill.value = bill.value - income.value;
    await this.billsService.updateBill(income.billId, userId, bill);

    return await this.incomeModel.deleteOne({ _id: id });
  }
}