import {ApiProperty} from '@nestjs/swagger';

export class OnboardingRequestDto {
  @ApiProperty({
    description: 'License key for the company',
    example: 'ABC123XYZ',
  })
  licenseKey: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Acme Corp',
  })
  companyName: string;

  @ApiProperty({
    description: 'Company URL (optional)',
    required: false,
    example: 'https://acme.com',
  })
  companyUrl?: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@acme.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'SecurePass123!',
  })
  password: string;

  @ApiProperty({
    description: 'Confirm password',
    example: 'SecurePass123!',
  })
  confirmPassword: string;
}

export class OnboardingResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Created user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Created tenant ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  tenantId: string;
}
