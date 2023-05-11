import { Body, Controller, UseGuards, HttpCode, HttpStatus, Req, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CostService } from './costs.service';
import { CostDto } from './dto/cost.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('costs')
export class CostController {
  constructor(
    private readonly costService: CostService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOneCost(@Param('id') id: string) {
    return await this.costService.findOneCost(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getCosts(@Req() req: any) {
    const userId = req.user._id;
    return await this.costService.findAllCosts(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCost(@Req() req: any, @Body() costDto: CostDto) {
    const userId = req.user._id;
    return await this.costService.createCost({ ...costDto, userId});
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateCost(@Param('id') id: string, @Body() costDto: CostDto) {
    return await this.costService.updateCost(id, costDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteCost(@Param('id') id: string) {
    const deleted = await this.costService.deleteCost(id);
    if (deleted.deletedCount) return { "cost deleted": deleted.deletedCount };
  }
}