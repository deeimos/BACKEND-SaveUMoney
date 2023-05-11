import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { CostModel } from 'src/models/cost.model';
import { CostDto } from './dto/cost.dto';
import { BillService } from 'src/bills/bill.service';
import { UpdateBillDto } from 'src/bills/dto/updateBill.dto';

@Injectable()
export class CostService {
  constructor(
    @InjectModel(CostModel.name)
    private costModel: Model<CostModel>,
    private billService: BillService,
  ) { }

  async findOneCost(id: string) {
    return await this.costModel.findOne({ '_id': id }).exec();
  }

  async findBillCosts(billId: any) {
    return await this.costModel.find().where('billId').in(billId).exec();
  }

  async findAllCosts(userId: any) {
    return await this.costModel.find().where('userId').in(userId).exec();
  }

  async createCost(costDto: CostDto) {
    const createdCost = new this.costModel(costDto);
    const bill: UpdateBillDto = await this.billService.findOneBill(costDto.billId);

    if (bill.value < costDto.value) {
      throw new HttpException('Not enough funds on the bill', HttpStatus.BAD_REQUEST);
    }

    const changeValueBill = bill.value - costDto.value;
    bill.value = changeValueBill;
    await this.billService.updateBill(costDto.billId, bill);
    return await createdCost.save();
  }

  async updateCost(id: string, costDto: CostDto) {
    const oldCost: CostDto = await this.findOneCost(id);
    if (!costDto.billId)
      costDto.billId = oldCost.billId;
    const bill = await this.billService.findOneBill(costDto.billId);;

    if (!costDto.value && costDto.value !== 0) {
      costDto.value = oldCost.value;
    }

    if (bill.value < costDto.value) {
      throw new HttpException('Not enough funds on the bill', HttpStatus.BAD_REQUEST);
    }

    if (costDto.billId !== oldCost.billId) {
      const oldBill: UpdateBillDto = await this.billService.findOneBill(oldCost.billId);
      oldBill.value = oldBill.value + oldCost.value;
      console.log(oldCost, oldBill);
      await this.billService.updateBill(oldCost.billId, oldBill);
      bill.value = bill.value - costDto.value;
    }
    else bill.value = bill.value + oldCost.value - costDto.value;
    
    await this.billService.updateBill(costDto.billId, bill);
    await this.costModel.updateOne(
      { _id: id },
      {
        $set: {
          ...costDto
        },
      },
    );

    return await this.findOneCost(id);
  }

  async deleteCost(id: string) {
    const cost = await this.findOneCost(id);
    const bill: UpdateBillDto = await this.billService.findOneBill(cost.billId);

    const changeValueBill = bill.value + cost.value;
    bill.value = changeValueBill;
    await this.billService.updateBill(cost.billId, bill);

    return await this.costModel.deleteOne({ _id: id });
  }
}