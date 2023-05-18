// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';

// import { Model } from 'mongoose';
// import { IncomeModel } from 'src/models/income.model';
// import { CreateIncomeDto } from './dto/createIncome.dto';
// import { UpdateIncomeDto } from './dto/updateIncome.dto';
// import { BillsService } from 'src/bills/bills.service';
// import { UpdateBillDto } from 'src/bills/dto/updateBill.dto';
// import { CategoryDto } from 'src/categories/dto/category.dto';
// import { IncomesCategoriesService } from 'src/categories/incomes/incomeCategories.service';

// @Injectable()
// export class IncomesService {
//   constructor(
//     @InjectModel(IncomeModel.name)
//     private incomeModel: Model<IncomeModel>,
//     private billsService: BillsService,
//     private incomesCategoriesService: IncomesCategoriesService,
//   ) { }

//   async findOneIncome(id: string) {
//     return await this.incomeModel.findOne({ '_id': id }).exec();
//   }

//   async findBillIncomes(billId: any) {
//     return await this.incomeModel.find().where('billId').in(billId).exec();
//   }

//   async findAllIncomes(userId: any) {
//     return await this.incomeModel.find().where('userId').in(userId).exec();
//   }

//   // async createIncome(createIncomeDto: CreateIncomeDto) {
//   //   const createdIncome = new this.incomeModel(createIncomeDto);
//   //   const categories = await this.incomesCategoriesService.findAllCategories();
//   //   const bill = await this.billsService.findOneBill(createIncomeDto.billId);

//   //   if (createIncomeDto.userId !== bill.userId) {
//   //     throw new HttpException('Access error', HttpStatus.NOT_ACCEPTABLE);
//   //   }

//   //   if (createIncomeDto.value <= 0) {
//   //     throw new HttpException('Income must be greater than 0', HttpStatus.BAD_REQUEST);
//   //   }

//   //   if (!categories.some((category) => String(category._id) === createIncomeDto.categoryId)) {
//   //     throw new HttpException('Invalid categoryId', HttpStatus.BAD_REQUEST);
//   //   }

//   //   const changeValueBill = bill.value - createIncomeDto.value;
//   //   bill.value = changeValueBill;
//   //   await this.billsService.updateBill(createIncomeDto.billId, bill);
//   //   return await createdIncome.save();
//   // }

//   async createIncome(createIncomeDto: CreateIncomeDto) {
//     const createdIncome = new this.incomeModel(createIncomeDto);
//     const categories = await this.incomesCategoriesService.findAllCategories();
//     const userId = '0';
//     const bill = await this.billsService.findOneBill(createIncomeDto.billId, userId);

//     switch (true) {
//       case (createIncomeDto.userId !== bill.userId):
//         throw new HttpException('Access error', HttpStatus.NOT_ACCEPTABLE);

//       case (createIncomeDto.value <= 0):
//         throw new HttpException('Income must be greater than 0', HttpStatus.BAD_REQUEST);

//       case (!categories.some((category) => String(category._id) === createIncomeDto.categoryId)):
//         throw new HttpException('Invalid categoryId', HttpStatus.BAD_REQUEST);

//       default:
//         const changeValueBill = bill.value - createIncomeDto.value;
//         bill.value = changeValueBill;
//     }

//     await this.billsService.updateBill(createIncomeDto.billId, userId, bill);
//     return await createdIncome.save();
//   }

//   // async updateIncome(id: string, updateIncomeDto: UpdateIncomeDto) {
//   //   const oldIncome: UpdateIncomeDto = await this.findOneIncome(id);
//   //   const categories = await this.incomesCategoriesService.findAllCategories();
//   //   const bill = await this.billsService.findOneBill(updateIncomeDto.billId);

//   //   if (!updateIncomeDto.categoryId)
//   //     updateIncomeDto.categoryId = oldIncome.categoryId;
//   //   const categories = await this.incomesCategoriesService.findAllCategories();

//   //   if (!updateIncomeDto.billId)
//   //     updateIncomeDto.billId = oldIncome.billId;
//   //   const bill = await this.billsService.findOneBill(updateIncomeDto.billId);

//   //   if (!categories.some((category) => String(category._id) === updateIncomeDto.categoryId)) {
//   //     throw new HttpException('Invalid categoryId', HttpStatus.BAD_REQUEST);
//   //   }

//   //   if (!updateIncomeDto.value && updateIncomeDto.value !== 0) {
//   //     updateIncomeDto.value = oldIncome.value;
//   //   }

//   //   if (updateIncomeDto.value <= 0) {
//   //     throw new HttpException('income must be greater than 0', HttpStatus.BAD_REQUEST);
//   //   }

//   //   if (updateIncomeDto.billId !== oldIncome.billId) {
//   //     const oldBill: UpdateBillDto = await this.billsService.findOneBill(oldIncome.billId);
//   //     oldBill.value = oldBill.value - oldIncome.value;
//   //     console.log(oldIncome, oldBill);
//   //     await this.billsService.updateBill(oldIncome.billId, oldBill);
//   //     bill.value = bill.value + updateIncomeDto.value;
//   //   }
//   //   else bill.value = bill.value - oldIncome.value + updateIncomeDto.value;

//   //   await this.billsService.updateBill(updateIncomeDto.billId, bill);
//   //   await this.incomeModel.updateOne(
//   //     { _id: id },
//   //     {
//   //       $set: {
//   //         ...updateIncomeDto
//   //       },
//   //     },
//   //   );

//   //   return await this.findOneIncome(id);
//   // }

//   async updateIncome(id: string, userId: string, updateIncomeDto: UpdateIncomeDto) {
//     const oldIncome: UpdateIncomeDto = await this.findOneIncome(id);
//     const categories = await this.incomesCategoriesService.findAllCategories();
//     const bill = await this.billsService.findOneBill(updateIncomeDto.billId, userId);

//     switch (true) {
//       case (!updateIncomeDto.billId):
//         updateIncomeDto.billId = oldIncome.billId;

//       case (!updateIncomeDto.categoryId):
//         updateIncomeDto.categoryId = oldIncome.categoryId;

//       case (userId !== bill.userId):
//         throw new HttpException('Access error', HttpStatus.NOT_ACCEPTABLE);

//       case (!categories.some((category) => String(category._id) === updateIncomeDto.categoryId)):
//         throw new HttpException('Invalid categoryId', HttpStatus.BAD_REQUEST);

//       case (!updateIncomeDto.value && updateIncomeDto.value !== 0):
//         updateIncomeDto.value = oldIncome.value;

//       case (updateIncomeDto.value <= 0):
//         throw new HttpException('income must be greater than 0', HttpStatus.BAD_REQUEST);

//       case (updateIncomeDto.billId !== oldIncome.billId):
//         const oldBill: UpdateBillDto = await this.billsService.findOneBill(oldIncome.billId, userId);
//         oldBill.value = oldBill.value - oldIncome.value;
//         console.log(oldIncome, oldBill);
//         await this.billsService.updateBill(oldIncome.billId, userId, oldBill);
//         bill.value = bill.value + updateIncomeDto.value;

//       default:
//         bill.value = bill.value - oldIncome.value + updateIncomeDto.value;
//     }

//     await this.billsService.updateBill(updateIncomeDto.billId, userId, bill);
//     await this.incomeModel.updateOne(
//       { _id: id },
//       {
//         $set: {
//           ...updateIncomeDto
//         },
//       },
//     );

//     return await this.findOneIncome(id);
//   }


//   async deleteIncome(id: string, userId: string) {
//     const income: UpdateIncomeDto = await this.findOneIncome(id);
//     const bill = await this.billsService.findOneBill(income.billId, userId);
    
//     if (userId !== bill.userId)
//       throw new HttpException('Access error', HttpStatus.NOT_ACCEPTABLE);

//     const changeValueBill = bill.value - income.value;
//     bill.value = changeValueBill;
//     await this.billsService.updateBill(income.billId, bill);

//     return await this.incomeModel.deleteOne({ _id: id });
//   }
// }