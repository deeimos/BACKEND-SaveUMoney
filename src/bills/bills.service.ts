import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { BillModel } from 'src/models/bill.model';
import { CreateBillDto } from './dto/createBill.dto';
import { UpdateBillDto } from './dto/updateBill.dto';

@Injectable()
export class BillsService {
  constructor(
    @InjectModel(BillModel.name)
    private billModel: Model<BillModel>,
  ) { }

  async findOneBill(id: string, userId: string) {
    const bill = await this.billModel.findOne({ '_id': id }).exec();

    if (!bill)
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);

    if (userId.toString() !== bill.userId)
      throw new HttpException('Access error', HttpStatus.NOT_ACCEPTABLE);

    return bill;
  }

  async findAllBills(userId: any) {
    return await this.billModel.find().where('userId').in(userId).exec();
  }

  async createBill(createBillDto: CreateBillDto) {
    const createdBill = new this.billModel(createBillDto);
    return await createdBill.save();
  }

  async updateBill(id: string, userId: string, updateBillDto: UpdateBillDto) {
    await this.findOneBill(id, userId);
    await this.billModel.updateOne(
      { _id: id },
      {
        $set: {
          ...updateBillDto
        },
      },
    );

    return this.findOneBill(id, userId);
  }

  async deleteBill(id: string, userId: string) {
    await this.findOneBill(id, userId);
    return await this.billModel.deleteOne({ _id: id });
  }
}