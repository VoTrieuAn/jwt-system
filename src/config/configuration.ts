import { TokenConfig } from './entities/token-config.entity';

export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  tokens: new TokenConfig({
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  }),
  database: {
    url: process.env.DATABASE_URL,
  },
});
