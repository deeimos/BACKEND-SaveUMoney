import { Body, Controller, UseGuards, HttpCode, HttpStatus, Req, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/createBill.dto';
import { UpdateBillDto } from './dto/updateBill.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('bills')
export class BillsController {
  constructor(
    private readonly billsService: BillsService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOneBill(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id;
    return await this.billsService.findOneBill(id, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getBills(@Req() req: any) {
    const userId = req.user._id;
    return await this.billsService.findAllBills(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBill(@Req() req: any, @Body() createBillDto: CreateBillDto) {
    const userId = req.user._id;
    return await this.billsService.createBill({ ...createBillDto, userId });
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateBill(@Param('id') id: string, @Req() req: any, @Body() updateBillDto: UpdateBillDto) {
    const userId = req.user._id;
    return await this.billsService.updateBill(id, userId, updateBillDto);
  }

  // @HttpCode(HttpStatus.OK)
  // @Delete(':id')
  // async deleteBill(@Param('id') id: string, @Req() req: any,) {
  //   const userId = req.user._id;
  //   const deleted = await this.billsService.deleteBill(id, userId);
  //   if (deleted.deletedCount) return { "bill deleted": deleted.deletedCount };
  // }
}