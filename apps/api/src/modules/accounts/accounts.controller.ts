import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll() { return this.accountsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.accountsService.findOne(id); }

  @Post()
  create(@Body() dto: any) { return this.accountsService.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) { return this.accountsService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.accountsService.remove(id); }
}
