import {Controller, Post, Body, Res, UsePipes, HttpCode, HttpStatus} from '@nestjs/common';
import type {Response} from 'express';
import {AuthService} from './auth.service';
import type {LoginDTO} from '@acme/contracts';
import {loginSchema} from '@acme/contracts';
import {ZodValidationPipe} from '../common/pipes/zod-validation.pipe';

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
}
