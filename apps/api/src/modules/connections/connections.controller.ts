import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { CreateConnectionDtoSchema, UpdateConnectionDtoSchema } from '@trooper/shared';
import type { CreateConnectionDto, UpdateConnectionDto } from '@trooper/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get()
  findAll() {
    return this.connectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.connectionsService.findOne(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateConnectionDtoSchema))
  create(@Body() dto: CreateConnectionDto) {
    return this.connectionsService.create(dto);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateConnectionDtoSchema))
  update(@Param('id') id: string, @Body() dto: UpdateConnectionDto) {
    return this.connectionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.connectionsService.remove(id);
  }
}
