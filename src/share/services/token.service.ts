import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload, JwtTokens } from '../entities/jwt.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenConfig } from 'src/config/entities/token-config.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private signAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<TokenConfig>('tokens')?.accessTokenSecret,
      algorithm: 'HS256',
      expiresIn: '5m',
    });
  }

  private signRefreshToken(payload: JwtPayload): Promise<string> {
    {
      return this.jwtService.signAsync(payload, {
        secret: this.configService.get<TokenConfig>('tokens')?.refreshTokenSecret,
        algorithm: 'HS256',
        expiresIn: '7d',
      });
    }
  }

  private verifyToken(token: string, secret: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret,
      algorithms: ['HS256'],
    });
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
      const decoded: JwtPayload = await this.verifyToken(
        token,
        this.configService.get<TokenConfig>('tokens')?.refreshTokenSecret as string,
      );
      return decoded;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const decoded: JwtPayload = await this.verifyToken(
        token,
        this.configService.get<TokenConfig>('tokens')?.accessTokenSecret as string,
      );
      return decoded;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
