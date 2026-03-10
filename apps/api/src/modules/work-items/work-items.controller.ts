import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { WorkItemsService } from './work-items.service';

@Controller('work-items')
export class WorkItemsController {
  constructor(private readonly workItemsService: WorkItemsService) {}

  @Get()
  findAll() {
    return this.workItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workItemsService.findOne(id);
  }

  @Post()
  create(@Body() dto: { azureId: number; title: string; description: string; type: string; assignedTo?: string }) {
    return this.workItemsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.workItemsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workItemsService.remove(id);
  }
}
