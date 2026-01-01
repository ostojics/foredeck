import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService as NestJwtService} from '@nestjs/jwt';
import {GlobalConfig} from '../config/config.interface';
import {JwtConfig, JwtConfigName} from '../config/jwt.config';
import {Response} from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
}

/**
 * JWT service for token generation, validation, and cookie management.
 * Uses HttpOnly, Secure, and SameSite flags for security.
 */
@Injectable()
export class JwtService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly configService: ConfigService<GlobalConfig>,
    private readonly jwtService: NestJwtService,
  ) {
    this.jwtConfig = this.configService.getOrThrow<JwtConfig>(JwtConfigName);
  }

  /**
   * Generate an access token for a user.
   */
  async generateToken(userId: string, email: string, tenantId: string): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      tenantId,
    };

    return this.jwtService.signAsync(payload);
  }

  /**
   * Verify and decode a JWT token.
   */
  async verifyToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }

  /**
   * Set JWT token as HttpOnly cookie in the response.
   */
  setTokenCookie(res: Response, token: string): void {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: this.parseExpiresIn(this.jwtConfig.expiresIn),
      path: '/',
    });
  }

  /**
   * Clear JWT cookie from the response (logout).
   */
  clearTokenCookie(res: Response): void {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  /**
   * Parse expiresIn string to milliseconds.
   */
  private parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 15 * 60 * 1000; // default 15 minutes
    }
  }
}
