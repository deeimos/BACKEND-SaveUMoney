
import { Body, Controller, UseGuards, HttpCode, HttpStatus, Req, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClearService } from './clear.service';

@UseGuards(AuthGuard('jwt'))
@Controller('clear')
export class ClearController {
  constructor(
    private readonly clearService: ClearService
  ) { }
  @HttpCode(HttpStatus.OK)
  @Delete('bills/:id')
  async deleteBill(@Param('id') id: string, @Req() req: any,) {
    const userId = req.user._id.toString();
    const deleted = await this.clearService.clearBillInfo(id, userId);
    if (deleted) return { deleted };
  }
}