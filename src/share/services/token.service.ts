import { Injectable } from '@nestjs/common';
import { JwtPayload, JwtTokens } from '../types/jwt.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  private signAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      algorithm: 'HS256',
      expiresIn: '5m',
    });
  }

  private signRefreshToken(payload: JwtPayload): Promise<string> {
    {
      return this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        algorithm: 'HS256',
        expiresIn: '7d',
      });
    }
  }

  async generateTokens(payload: JwtPayload): Promise<JwtTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);
    return { accessToken, refreshToken };
  }
}
