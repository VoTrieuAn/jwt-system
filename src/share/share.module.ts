import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { ApiKeyGuard } from './guards/api-key.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { ConfigModule } from '@nestjs/config';

const SHARE_SERVICES = [PrismaService, HashingService, TokenService];

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [
    ...SHARE_SERVICES,
    // Đăng ký các guard để có thể inject vào AuthenticationGuard
    AccessTokenGuard,
    ApiKeyGuard,
    // Đăng ký AuthenticationGuard như một APP_GUARD để áp dụng toàn cục
    {
      provide: 'APP_GUARD',
      useClass: AuthenticationGuard,
    },
  ],
  exports: SHARE_SERVICES,
})
export class ShareModule {}
