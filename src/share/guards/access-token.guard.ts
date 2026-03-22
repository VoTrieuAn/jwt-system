import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { REQ_USER_KEY } from '../constants/auth.constant';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const accessToken = req.headers['authorization']?.split(' ')[1];

      if (!accessToken) {
        throw new UnauthorizedException('Access token is missing');
      }

      const decodedAccessToken = await this.tokenService.verifyAccessToken(accessToken);
      req[REQ_USER_KEY] = decodedAccessToken;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
