import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { BillModel } from 'src/models/bill.model';
import { CreateBillDto } from './dto/createBill.dto';
import { UpdateBillDto } from './dto/updateBill.dto';

@Injectable()
export class BillService {
  constructor(
    @InjectModel(BillModel.name)
    private billModel: Model<BillModel>,
  ) { }

  async createBill( createBillDto: CreateBillDto) {
    const createdBill = new this.billModel(createBillDto);
    return createdBill.save();
  }

  async findOneBill(id: string) {
    return this.billModel.findOne({ '_id': id }).exec();
  }

  async findAllBills(userId: any) {
    return await this.billModel.find().where('_id').in(userId).exec();
  }

  async updateBill(id: string, updateBillDto: UpdateBillDto) {
    await this.billModel.updateOne(
      { _id: id },
      {
        $set: {
          ...updateBillDto
        },
      },
    );

    return this.findOneBill(id);
  }

  async deleteBill(id: string) {
    await this.billModel.deleteOne({ _id: id });
  }
}