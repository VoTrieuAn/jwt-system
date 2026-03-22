export class JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;

  constructor(partial: Partial<JwtPayload>) {
    Object.assign(this, partial);
  }
}

export class JwtTokens {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<JwtTokens>) {
    Object.assign(this, partial);
  }
}
