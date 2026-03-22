import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token is not valid' })
  refreshToken: string;
}
