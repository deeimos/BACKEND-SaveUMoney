import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { CostModel } from 'src/models/cost.model';
import { CreateCostDto } from './dto/createCost.dto';
import { UpdateCostDto } from './dto/updateCost.dto';
import { BillsService } from 'src/bills/bills.service';
import { UpdateBillDto } from 'src/bills/dto/updateBill.dto';

@Injectable()
export class CostsService {
  constructor(
    @InjectModel(CostModel.name)
    private costModel: Model<CostModel>,
    private billsService: BillsService,
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

  async createCost(createCostDto: CreateCostDto) {
    const createdCost = new this.costModel(createCostDto);
    const bill: UpdateBillDto = await this.billsService.findOneBill(createCostDto.billId);

    if (bill.value < createCostDto.value) {
      throw new HttpException('Not enough funds on the bill', HttpStatus.BAD_REQUEST);
    }

    const changeValueBill = bill.value - createCostDto.value;
    bill.value = changeValueBill;
    await this.billsService.updateBill(createCostDto.billId, bill);
    return await createdCost.save();
  }

  async updateCost(id: string, updateCostDto: UpdateCostDto) {
    const oldCost: UpdateCostDto = await this.findOneCost(id);
    if (!updateCostDto.billId)
      updateCostDto.billId = oldCost.billId;
    const bill = await this.billsService.findOneBill(updateCostDto.billId);

    if (!updateCostDto.value && updateCostDto.value !== 0) {
      updateCostDto.value = oldCost.value;
    }

    if (bill.value < updateCostDto.value) {
      throw new HttpException('Not enough funds on the bill', HttpStatus.BAD_REQUEST);
    }

    if (updateCostDto.billId !== oldCost.billId) {
      const oldBill: UpdateBillDto = await this.billsService.findOneBill(oldCost.billId);
      oldBill.value = oldBill.value + oldCost.value;
      console.log(oldCost, oldBill);
      await this.billsService.updateBill(oldCost.billId, oldBill);
      bill.value = bill.value - updateCostDto.value;
    }
    else bill.value = bill.value + oldCost.value - updateCostDto.value;

    await this.billsService.updateBill(updateCostDto.billId, bill);
    await this.costModel.updateOne(
      { _id: id },
      {
        $set: {
          ...updateCostDto
        },
      },
    );

    return await this.findOneCost(id);
  }

  async deleteCost(id: string) {
    const cost: UpdateCostDto = await this.findOneCost(id);
    const bill: UpdateBillDto = await this.billsService.findOneBill(cost.billId);

    const changeValueBill = bill.value + cost.value;
    bill.value = changeValueBill;
    await this.billsService.updateBill(cost.billId, bill);

    return await this.costModel.deleteOne({ _id: id });
  }
}