import {Controller, Post, Body, UsePipes, Res, HttpStatus} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {Response} from 'express';
import {onboardingSchema} from '@acme/contracts';
import {ZodValidationPipe} from '../common/pipes/zod-validation.pipe';
import {OnboardingService} from './onboarding.service';
import {OnboardingRequestDto, OnboardingResponseDto} from './dto/onboarding.dto';
import {JwtService} from '../auth/jwt.service';

@ApiTags('Onboarding')
@Controller({path: 'onboarding', version: '1'})
export class OnboardingController {
  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(onboardingSchema))
  @ApiOperation({summary: 'Complete user and company onboarding'})
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Onboarding completed successfully',
    type: OnboardingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data or license key',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'License key already used or email already exists',
  })
  async onboard(
    @Body() body: OnboardingRequestDto,
    @Res({passthrough: true}) res: Response,
  ): Promise<OnboardingResponseDto> {
    const result = await this.onboardingService.onboardUser({
      licenseKey: body.licenseKey,
      companyName: body.companyName,
      companyUrl: body.companyUrl,
      fullName: body.fullName,
      email: body.email,
      password: body.password,
    });

    const token = await this.jwtService.generateToken(result.userId, result.email, result.tenantId);
    this.jwtService.setTokenCookie(res, token);

    res.status(HttpStatus.CREATED);

    return {
      success: true,
      userId: result.userId,
      tenantId: result.tenantId,
    };
  }
}
