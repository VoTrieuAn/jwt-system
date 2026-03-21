import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';

const SHARE_SERVICES = [PrismaService];

@Global()
@Module({
  providers: SHARE_SERVICES,
  exports: SHARE_SERVICES,
})
export class ShareModule {}
