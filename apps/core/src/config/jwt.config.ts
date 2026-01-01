import {registerAs} from '@nestjs/config';

export const JwtConfigName = 'jwt';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export const jwtConfig = registerAs(
  JwtConfigName,
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRY || '15m',
  }),
);
