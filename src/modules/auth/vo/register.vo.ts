import { JwtTokens } from 'src/share/entities/jwt.entity';

export class RegisterVo {
  data: {
    id: string;
    name: string;
    email: string;
  };
  message: string;
  tokens: JwtTokens;

  constructor(partial: Partial<RegisterVo>) {
    Object.assign(this, partial);
  }
}
