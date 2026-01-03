import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {OnboardingController} from './onboarding.controller';
import {OnboardingService} from './onboarding.service';
import {LicenseEntity, TenantEntity, UserEntity, UserIdentityEntity} from '../entities';
import {JwtModule} from '../auth/jwt.module';
import {LicenseRepository, TenantRepository, UserRepository, UserIdentityRepository} from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([LicenseEntity, TenantEntity, UserEntity, UserIdentityEntity]), JwtModule],
  controllers: [OnboardingController],
  providers: [OnboardingService, LicenseRepository, TenantRepository, UserRepository, UserIdentityRepository],
})
export class OnboardingModule {}
