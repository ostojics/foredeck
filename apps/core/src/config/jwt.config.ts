import {registerAs} from '@nestjs/config';

export const JwtConfigName = 'jwt';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export const jwtConfig = registerAs(
  JwtConfigName,
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  }),
);
