import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload, JwtTokens } from '../entities/jwt.entity';
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

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      const decoded: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        algorithms: ['HS256'],
      });
      return decoded;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const decoded: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        algorithms: ['HS256'],
      });
      return decoded;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
