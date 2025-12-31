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
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
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
  async generateAccessToken(userId: string, email: string, tenantId: string): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      tenantId,
      type: 'access',
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.jwtService.signAsync(payload as any, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expiresIn: this.jwtConfig.accessTokenExpiresIn as any,
    });
  }

  /**
   * Generate a refresh token for a user.
   */
  async generateRefreshToken(userId: string, email: string, tenantId: string): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      tenantId,
      type: 'refresh',
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.jwtService.signAsync(payload as any, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expiresIn: this.jwtConfig.refreshTokenExpiresIn as any,
    });
  }

  /**
   * Generate both access and refresh tokens.
   */
  async generateTokenPair(userId: string, email: string, tenantId: string): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId, email, tenantId),
      this.generateRefreshToken(userId, email, tenantId),
    ]);

    return {accessToken, refreshToken};
  }

  /**
   * Verify and decode a JWT token.
   */
  async verifyToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }

  /**
   * Set JWT tokens as HttpOnly cookies in the response.
   */
  setTokenCookies(res: Response, tokens: TokenPair): void {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: this.parseExpiresIn(this.jwtConfig.accessTokenExpiresIn),
      path: '/',
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: this.parseExpiresIn(this.jwtConfig.refreshTokenExpiresIn),
      path: '/',
    });
  }

  /**
   * Clear JWT cookies from the response (logout).
   */
  clearTokenCookies(res: Response): void {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.clearCookie('refresh_token', {
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
