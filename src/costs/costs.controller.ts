import { Body, Controller, UseGuards, HttpCode, HttpStatus, Req, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CostsService } from './costs.service';
import { CreateCostDto } from './dto/createCost.dto';
import { UpdateCostDto } from './dto/updateCost.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('costs')
export class CostsController {
  constructor(
    private readonly costsService: CostsService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOneCost(@Param('id') id: string) {
    return await this.costsService.findOneCost(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getCosts(@Req() req: any) {
    const userId = req.user._id;
    return await this.costsService.findAllCosts(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCost(@Req() req: any, @Body() createCostDto: CreateCostDto) {
    const userId = req.user._id;
    return await this.costsService.createCost({ ...createCostDto, userId});
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateCost(@Param('id') id: string, @Body() createCostDto: CreateCostDto) {
    return await this.costsService.updateCost(id, createCostDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteCost(@Param('id') id: string) {
    const deleted = await this.costsService.deleteCost(id);
    if (deleted.deletedCount) return { "cost deleted": deleted.deletedCount };
  }
}