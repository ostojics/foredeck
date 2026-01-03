import {Controller, Post, Body, Res, UsePipes, HttpCode, HttpStatus, Get, UseGuards} from '@nestjs/common';
import type {Response} from 'express';
import {AuthService} from './auth.service';
import type {LoginDTO, MeResponseDTO} from '@acme/contracts';
import {loginSchema} from '@acme/contracts';
import {ZodValidationPipe} from '../common/pipes/zod-validation.pipe';
import {JwtAuthGuard} from '../common/guards/jwt-auth.guard';
import {CurrentUser} from '../common/decorators/current-user.decorator';
import type {JwtPayload} from './jwt.service';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDTO, @Res({passthrough: true}) res: Response): Promise<{message: string}> {
    await this.authService.login(loginDto.email, loginDto.password, res);
    return {message: 'Login successful'};
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: JwtPayload): Promise<MeResponseDTO> {
    return this.authService.getUserById(user.sub);
  }
}
