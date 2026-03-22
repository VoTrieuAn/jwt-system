import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestHeaders } from '../constants/req.constant';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const apiKey = req.headers[RequestHeaders.X_API_KEY];

    if (apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
