import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ExpenseModel } from 'src/models/expense.model';
import { CreateExpenseDto } from './dto/createExpense.dto';
import { UpdateExpenseDto } from './dto/updateExpense.dto';
import { BillsService } from 'src/bills/bills.service';
import { UpdateBillDto } from 'src/bills/dto/updateBill.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(ExpenseModel.name)
    private expenseModel: Model<ExpenseModel>,
    private billsService: BillsService,
  ) { }

  async findOneExpense(id: string) {
    return await this.expenseModel.findOne({ '_id': id }).exec();
  }

  async findBillExpenses(billId: any) {
    return await this.expenseModel.find().where('billId').in(billId).exec();
  }

  async findAllExpenses(userId: any) {
    return await this.expenseModel.find().where('userId').in(userId).exec();
  }

  async createExpense(createExpenseDto: CreateExpenseDto) {
    const createdExpense = new this.expenseModel(createExpenseDto);
    const bill: UpdateBillDto = await this.billsService.findOneBill(createExpenseDto.billId);

    if (bill.value < createExpenseDto.value) {
      throw new HttpException('Not enough funds on the bill', HttpStatus.BAD_REQUEST);
    }

    const changeValueBill = bill.value - createExpenseDto.value;
    bill.value = changeValueBill;
    await this.billsService.updateBill(createExpenseDto.billId, bill);
    return await createdExpense.save();
  }

  async updateExpense(id: string, updateExpenseDto: UpdateExpenseDto) {
    const oldExpence: UpdateExpenseDto = await this.findOneExpense(id);
    if (!updateExpenseDto.billId)
      updateExpenseDto.billId = oldExpence.billId;
    const bill = await this.billsService.findOneBill(updateExpenseDto.billId);

    if (!updateExpenseDto.value && updateExpenseDto.value !== 0) {
      updateExpenseDto.value = oldExpence.value;
    }

    if (bill.value < updateExpenseDto.value) {
      throw new HttpException('Not enough funds on the bill', HttpStatus.BAD_REQUEST);
    }

    if (updateExpenseDto.billId !== oldExpence.billId) {
      const oldBill: UpdateBillDto = await this.billsService.findOneBill(oldExpence.billId);
      oldBill.value = oldBill.value + oldExpence.value;
      console.log(oldExpence, oldBill);
      await this.billsService.updateBill(oldExpence.billId, oldBill);
      bill.value = bill.value - updateExpenseDto.value;
    }
    else bill.value = bill.value + oldExpence.value - updateExpenseDto.value;

    await this.billsService.updateBill(updateExpenseDto.billId, bill);
    await this.expenseModel.updateOne(
      { _id: id },
      {
        $set: {
          ...updateExpenseDto
        },
      },
    );

    return await this.findOneExpense(id);
  }

  async deleteExpense(id: string) {
    const expense: UpdateExpenseDto = await this.findOneExpense(id);
    const bill: UpdateBillDto = await this.billsService.findOneBill(expense.billId);

    const changeValueBill = bill.value + expense.value;
    bill.value = changeValueBill;
    await this.billsService.updateBill(expense.billId, bill);

    return await this.expenseModel.deleteOne({ _id: id });
  }
}