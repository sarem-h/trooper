import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';

@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly reposService: RepositoriesService) {}

  @Get()
  findAll() { return this.reposService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.reposService.findOne(id); }

  @Post()
  create(@Body() dto: any) { return this.reposService.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) { return this.reposService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.reposService.remove(id); }
}
