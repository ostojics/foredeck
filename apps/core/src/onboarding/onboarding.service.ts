import {Injectable, BadRequestException, ConflictException} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {hashPassword} from '../lib/hashing/hashing';
import {LicenseRepository, TenantRepository, UserRepository, UserIdentityRepository} from './repositories';

export interface OnboardingData {
  licenseKey: string;
  companyName: string;
  companyUrl?: string;
  fullName: string;
  email: string;
  password: string;
}

export interface OnboardingResult {
  userId: string;
  tenantId: string;
  email: string;
}

@Injectable()
export class OnboardingService {
  constructor(
    private readonly licenseRepository: LicenseRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly userRepository: UserRepository,
    private readonly userIdentityRepository: UserIdentityRepository,
    private readonly dataSource: DataSource,
  ) {}

  async onboardUser(data: OnboardingData): Promise<OnboardingResult> {
    return await this.dataSource.transaction(async (manager) => {
      const license = await this.licenseRepository.findByLicenseKey(data.licenseKey, manager);

      if (!license) {
        throw new BadRequestException('Invalid license key');
      }

      if (license.expiresAt < new Date()) {
        throw new BadRequestException('License has expired');
      }

      const existingTenant = await this.tenantRepository.findByLicenseId(license.id, manager);

      if (existingTenant) {
        throw new ConflictException('License key has already been used');
      }

      const existingIdentity = await this.userIdentityRepository.findByProviderAndProviderId(
        'local',
        data.email,
        manager,
      );

      if (existingIdentity) {
        throw new ConflictException('An account with this email already exists');
      }

      const slug = this.generateSlug(data.companyName);

      const tenant = await this.tenantRepository.create(
        {
          licenseId: license.id,
          name: data.companyName,
          slug,
          url: data.companyUrl || null,
        },
        manager,
      );

      const user = await this.userRepository.create(
        {
          tenantId: tenant.id,
          email: data.email,
          fullName: data.fullName,
        },
        manager,
      );

      const passwordHash = await hashPassword(data.password);

      const identity = await this.userIdentityRepository.create(
        {
          userId: user.id,
          provider: 'local',
          providerId: data.email,
          passwordHash,
        },
        manager,
      );

      return {
        userId: user.id,
        tenantId: tenant.id,
        email: user.email,
      };
    });
  }

  private generateSlug(companyName: string): string {
    return companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
