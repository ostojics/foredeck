import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {JwtPayload} from '../jwt.service';

/**
 * Decorator to extract the current user from the request.
 * Must be used with JwtAuthGuard.
 *
 * @example
 * ```typescript
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * async getProfile(@CurrentUser() user: JwtPayload) {
 *   return { userId: user.sub, email: user.email };
 * }
 * ```
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtPayload => {
  const request = ctx.switchToHttp().getRequest<{user: JwtPayload}>();
  return request.user;
});
