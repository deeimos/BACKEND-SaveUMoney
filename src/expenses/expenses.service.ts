import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ExpenseModel } from 'src/models/expense.model';
import { CreateExpenseDto } from './dto/createExpense.dto';
import { UpdateExpenseDto } from './dto/updateExpense.dto';
import { BillsService } from 'src/bills/bills.service';
import { UpdateBillDto } from 'src/bills/dto/updateBill.dto';
import { checkDate } from 'src/shared/checkDate';
import { ExpensesCategoriesService } from 'src/categories/expenses/expenseCategories.service';
import { GetExpensesDto } from './dto/getExpenses.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(ExpenseModel.name)
    private expenseModel: Model<ExpenseModel>,
    private billsService: BillsService,
    private expensesCategoriesService: ExpensesCategoriesService,
  ) { }

  async findOneExpense(id: string, userId: string) {
    const expense = await this.expenseModel.findOne({ '_id': id }).exec();

    if (!expense)
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);

    if (userId.toString() !== expense.userId)
      throw new HttpException('Access error', HttpStatus.NOT_ACCEPTABLE);

    return expense;
  }

  async findBillExpenses(billId: any) {
    return await this.expenseModel.find().where('billId').in(billId).exec();
  }

  // async findAllExpenses(userId: any) {
  //   return await this.expenseModel.find().where('userId').in(userId).exec();
  // }

  async findAllExpenses(userId: any, getExpensesDto: GetExpensesDto) {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(getExpensesDto.date)) {
      throw new Error("Invalid date format");
    }

    const dateParts = getExpensesDto.date.split(".");
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const firstDayOfMonth = new Date(year, month, 1, 23, 59, 59, 999);
    const lastDayOfMonth = new Date(year, month + 1, 1);

    const pipeline = [
      {
        $match: {
          userId: userId.toString(),
          date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        },
      },
      {
        $group: {
          _id: "$date",
          actions: { $push: "$$ROOT" },
        }
      },
      {
        $sort: {
          _id: -1,
        } as any
      },
    ];

    return await this.expenseModel.aggregate(pipeline).exec();
  }

  async totalExpenses(userId: any, getExpensesDto: GetExpensesDto) {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(getExpensesDto.date)) {
      throw new Error("Invalid date format");
    }

    const dateParts = getExpensesDto.date.split(".");
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const firstDayOfMonth = new Date(year, month, 1, 23, 59, 59, 999);
    const lastDayOfMonth = new Date(year, month + 1, 1);

    const pipeline = [
      {
        $match: {
          userId: userId.toString(),
          date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        },
      },
      {
        $group: {
          _id: "$date",
          actions: { $sum: "$value" },
        }
      },
      {
        $sort: {
          _id: 1,
        } as any
      },
    ];
    const result = await this.expenseModel.aggregate(pipeline).exec();
    const total = result.reduce((acc, cur) => acc + (cur.actions || 0), 0);
    const actions = result.map(({ _id, actions }) => ({ _id, value: actions }));

    return { actions, total };
  }

  async statExpenses(userId: string, getExpensesDto: GetExpensesDto) {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(getExpensesDto.date)) {
      throw new Error("Invalid date format");
    }

    const dateParts = getExpensesDto.date.split(".");
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const firstDayOfMonth = new Date(year, month, 1, 23, 59, 59, 999);
    const lastDayOfMonth = new Date(year, month + 1, 1);


     const pipeline = [
      {
        $match: {
          userId: userId.toString(),
          date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        },
      },
      {
        $group: {
          _id: "$categoryId",
          actions: { $sum: "$value" },
        }
      },
      {
        $sort: {
          _id: 1,
        } as any
      },
    ];

    return await this.expenseModel.aggregate(pipeline).exec();
  }
  

  async createExpense(createExpenseDto: CreateExpenseDto) {
    const categories = await this.expensesCategoriesService.findAllCategories();
    const bill = await this.billsService.findOneBill(createExpenseDto.billId, createExpenseDto.userId);

    switch (true) {
      case (createExpenseDto.userId.toString() !== bill.userId):
        throw new HttpException('Access error', HttpStatus.NOT_ACCEPTABLE);

      case (createExpenseDto.value <= 0):
        throw new HttpException('Expense must be greater than 0', HttpStatus.BAD_REQUEST);

      case (createExpenseDto.value > bill.value):
        throw new HttpException('bill value must be greater than expense', HttpStatus.BAD_REQUEST);

      case (!categories.some((category) => String(category._id) === createExpenseDto.categoryId)):
        throw new HttpException('Invalid categoryId', HttpStatus.BAD_REQUEST);

      default:
        const date = checkDate(createExpenseDto.date.toString());
        if (!date)
          throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST);

        createExpenseDto.date = date;
        bill.value = bill.value - createExpenseDto.value;
    }

    const createdExpense = new this.expenseModel(createExpenseDto);
    await this.billsService.updateBill(createExpenseDto.billId, createExpenseDto.userId, bill);
    return await createdExpense.save();
  }

  async updateExpense(id: string, userId: string, updateExpenseDto: UpdateExpenseDto) {
    const oldExpence: UpdateExpenseDto = await this.findOneExpense(id, userId);
    const categories = await this.expensesCategoriesService.findAllCategories();

    if (!updateExpenseDto.categoryId)
      updateExpenseDto.categoryId = oldExpence.categoryId;
    if (!updateExpenseDto.value && updateExpenseDto.value !== 0)
      updateExpenseDto.value = oldExpence.value;
    if (!updateExpenseDto.billId)
      updateExpenseDto.billId = oldExpence.billId;
    const bill = await this.billsService.findOneBill(updateExpenseDto.billId, userId);

    switch (true) {
      case (userId.toString() !== bill.userId):
        throw new HttpException('Access error', HttpStatus.NOT_ACCEPTABLE);

      case (!categories.some((category) => String(category._id) === updateExpenseDto.categoryId)):
        throw new HttpException('Invalid categoryId', HttpStatus.BAD_REQUEST);

      case (updateExpenseDto.value <= 0):
        throw new HttpException('expense must be greater than 0', HttpStatus.BAD_REQUEST);

      case (updateExpenseDto.value > bill.value):
        throw new HttpException('bill value must be greater than expense', HttpStatus.BAD_REQUEST);

      case (updateExpenseDto.billId !== oldExpence.billId):
        const oldBill: UpdateBillDto = await this.billsService.findOneBill(oldExpence.billId, userId);
        oldBill.value = oldBill.value + oldExpence.value;
        await this.billsService.updateBill(oldExpence.billId, userId, oldBill);
        bill.value = bill.value - oldExpence.value;

      default:
        if (updateExpenseDto.date) {
          const date = checkDate(updateExpenseDto.date.toString());
          if (!date)
            throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST);
          updateExpenseDto.date = date;
        }

        bill.value = bill.value + oldExpence.value - updateExpenseDto.value;
    }

    await this.billsService.updateBill(updateExpenseDto.billId, userId, bill);
    await this.expenseModel.updateOne(
      { _id: id },
      {
        $set: {
          ...updateExpenseDto
        },
      },
    );

    return await this.findOneExpense(id, userId);
  }


  async deleteExpense(id: string, userId: string) {
    const income: UpdateExpenseDto = await this.findOneExpense(id, userId);
    const bill = await this.billsService.findOneBill(income.billId, userId);

    bill.value = bill.value + income.value;
    await this.billsService.updateBill(income.billId, userId, bill);

    return await this.expenseModel.deleteOne({ _id: id });
  }

  async deleteExpensesBillId(billId: string, userId: string) {
    await this.billsService.findOneBill(billId, userId);
    return await this.expenseModel.deleteMany({ billId: billId });;
  }
}