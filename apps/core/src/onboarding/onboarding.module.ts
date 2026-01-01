import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {OnboardingController} from './onboarding.controller';
import {OnboardingService} from './onboarding.service';
import {LicenseEntity, TenantEntity, UserEntity, UserIdentityEntity} from '../entities';
import {JwtModule} from '../auth/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LicenseEntity, TenantEntity, UserEntity, UserIdentityEntity]),
    JwtModule,
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
