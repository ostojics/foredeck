import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {Request} from 'express';
import {JwtPayload, JwtService} from 'src/auth/jwt.service';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

/**
 * JWT authentication guard that validates access tokens from cookies.
 * Attaches the decoded user payload to the request object.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & {user: JwtPayload}>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }

    try {
      const payload = await this.jwtService.verifyToken(token);

      (request as AuthenticatedRequest).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies.access_token as string | undefined;
  }
}
