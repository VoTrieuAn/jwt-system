import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareModule } from './share/share.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ShareModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
