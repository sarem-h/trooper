import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MaskingService } from './masking.service';

@Controller('masking')
export class MaskingController {
  constructor(private readonly maskingService: MaskingService) {}

  @Get('rules')
  findAllRules() { return this.maskingService.findAllRules(); }

  @Post('rules')
  createRule(@Body() dto: any) { return this.maskingService.createRule(dto); }

  @Put('rules/:id')
  updateRule(@Param('id') id: string, @Body() dto: any) { return this.maskingService.updateRule(id, dto); }

  @Delete('rules/:id')
  removeRule(@Param('id') id: string) { return this.maskingService.removeRule(id); }

  @Get('audit')
  findAllAudit() { return this.maskingService.findAllAudit(); }
}
