export class TokenConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;

  constructor(partial: Partial<TokenConfig>) {
    Object.assign(this, partial);
  }
}
