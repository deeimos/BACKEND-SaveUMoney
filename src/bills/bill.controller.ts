import { Body, Controller, UseGuards, HttpCode, HttpStatus, Req, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/createBill.dto';
import { UpdateBillDto } from './dto/updateBill.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('bills')
export class BillController {
  constructor(
    private readonly billService: BillService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOneBill(@Param('id') id: string) {
    return await this.billService.findOneBill(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getBills(@Req() req: any) {
    const userId = req.user._id;
    return await this.billService.findAllBills(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBill(@Req() req: any, @Body() createBillDto: CreateBillDto) {
    const userId = req.user._id;
    return await this.billService.createBill({ ...createBillDto, userId });
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateBill(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    return await this.billService.updateBill(id, updateBillDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteBill(@Param('id') id: string) {
    const deleted = await this.billService.deleteBill(id);
    if (deleted.deletedCount) return { "bill deleted": deleted.deletedCount };
  }
}