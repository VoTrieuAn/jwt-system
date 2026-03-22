import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareModule } from './share/share.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [ShareModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
