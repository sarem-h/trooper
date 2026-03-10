import { Module } from '@nestjs/common';
import { MaskingController } from './masking.controller';
import { MaskingService } from './masking.service';

@Module({
  controllers: [MaskingController],
  providers: [MaskingService],
  exports: [MaskingService],
})
export class MaskingModule {}
