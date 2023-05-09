import { Body, Controller, HttpStatus, HttpException, Post, Res, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/createBill.dto';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthService } from 'src/auth/auth.service';

@Controller('bills')
export class BillController {
  constructor(
    private readonly billService: BillService,
    private readonly authService: AuthService,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createBill(@Req() req: any, @Body() createBillDto: CreateBillDto){
    const userId = req.user._id;
    return await this.billService.createBill({...createBillDto, userId});
  }
}