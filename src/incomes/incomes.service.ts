import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { IncomeModel } from 'src/models/income.model';
import { CreateIncomeDto } from './dto/createIncome.dto';
import { UpdateIncomeDto } from './dto/updateIncome.dto';
import { BillsService } from 'src/bills/bills.service';
import { UpdateBillDto } from 'src/bills/dto/updateBill.dto';

@Injectable()
export class IncomesService {
  constructor(
    @InjectModel(IncomeModel.name)
    private incomeModel: Model<IncomeModel>,
    private billsService: BillsService,
  ) { }

  async findOneIncome(id: string) {
    return await this.incomeModel.findOne({ '_id': id }).exec();
  }

  async findBillIncomes(billId: any) {
    return await this.incomeModel.find().where('billId').in(billId).exec();
  }

  async findAllIncomes(userId: any) {
    return await this.incomeModel.find().where('userId').in(userId).exec();
  }

  async createIncome(createIncomeDto: CreateIncomeDto) {
    const createdIncome = new this.incomeModel(createIncomeDto);
    const bill: UpdateBillDto = await this.billsService.findOneBill(createIncomeDto.billId);

    if (bill.value < createIncomeDto.value) {
      throw new HttpException('Not enough funds on the bill', HttpStatus.BAD_REQUEST);
    }

    const changeValueBill = bill.value - createIncomeDto.value;
    bill.value = changeValueBill;
    await this.billsService.updateBill(createIncomeDto.billId, bill);
    return await createdIncome.save();
  }

  async updateIncome(id: string, updateIncomeDto: UpdateIncomeDto) {
    const oldIncome: UpdateIncomeDto = await this.findOneIncome(id);
    if (!updateIncomeDto.billId)
    updateIncomeDto.billId = oldIncome.billId;
    const bill = await this.billsService.findOneBill(updateIncomeDto.billId);

    if (!updateIncomeDto.value && updateIncomeDto.value !== 0) {
      updateIncomeDto.value = oldIncome.value;
    }

    if (bill.value < updateIncomeDto.value) {
      throw new HttpException('Not enough funds on the bill', HttpStatus.BAD_REQUEST);
    }

    if (updateIncomeDto.billId !== oldIncome.billId) {
      const oldBill: UpdateBillDto = await this.billsService.findOneBill(oldIncome.billId);
      oldBill.value = oldBill.value - oldIncome.value;
      console.log(oldIncome, oldBill);
      await this.billsService.updateBill(oldIncome.billId, oldBill);
      bill.value = bill.value + updateIncomeDto.value;
    }
    else bill.value = bill.value - oldIncome.value + updateIncomeDto.value;

    await this.billsService.updateBill(updateIncomeDto.billId, bill);
    await this.incomeModel.updateOne(
      { _id: id },
      {
        $set: {
          ...updateIncomeDto
        },
      },
    );

    return await this.findOneIncome(id);
  }

  async deleteIncome(id: string) {
    const income: UpdateIncomeDto = await this.findOneIncome(id);
    const bill: UpdateBillDto = await this.billsService.findOneBill(income.billId);

    const changeValueBill = bill.value + income.value;
    bill.value = changeValueBill;
    await this.billsService.updateBill(income.billId, bill);

    return await this.incomeModel.deleteOne({ _id: id });
  }
}