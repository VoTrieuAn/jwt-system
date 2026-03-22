import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';

const SHARE_SERVICES = [PrismaService, HashingService, TokenService];

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: SHARE_SERVICES,
  exports: SHARE_SERVICES,
})
export class ShareModule {}
