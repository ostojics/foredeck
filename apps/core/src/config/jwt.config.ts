import {registerAs} from '@nestjs/config';

export const JwtConfigName = 'jwt';

export interface JwtConfig {
  secret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export const jwtConfig = registerAs(
  JwtConfigName,
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  }),
);
