import {Injectable, BadRequestException, ConflictException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, DataSource} from 'typeorm';
import {LicenseEntity, TenantEntity, UserEntity, UserIdentityEntity} from '../entities';
import {hashPassword} from '../lib/hashing/hashing';

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
    @InjectRepository(LicenseEntity)
    private readonly licenseRepository: Repository<LicenseEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserIdentityEntity)
    private readonly userIdentityRepository: Repository<UserIdentityEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async onboardUser(data: OnboardingData): Promise<OnboardingResult> {
    return await this.dataSource.transaction(async (manager) => {
      const licenseRepo = manager.getRepository(LicenseEntity);
      const tenantRepo = manager.getRepository(TenantEntity);
      const userRepo = manager.getRepository(UserEntity);
      const identityRepo = manager.getRepository(UserIdentityEntity);

      const license = await licenseRepo.findOne({
        where: {licenseKey: data.licenseKey},
      });

      if (!license) {
        throw new BadRequestException('Invalid license key');
      }

      if (license.expiresAt < new Date()) {
        throw new BadRequestException('License has expired');
      }

      const existingTenant = await tenantRepo.findOne({
        where: {licenseId: license.id},
      });

      if (existingTenant) {
        throw new ConflictException('License key has already been used');
      }

      const existingIdentity = await identityRepo.findOne({
        where: {provider: 'local', providerId: data.email},
      });

      if (existingIdentity) {
        throw new ConflictException('An account with this email already exists');
      }

      const slug = this.generateSlug(data.companyName);

      const tenant = tenantRepo.create({
        licenseId: license.id,
        name: data.companyName,
        slug,
        url: data.companyUrl || null,
      });
      await tenantRepo.save(tenant);

      const user = userRepo.create({
        tenantId: tenant.id,
        email: data.email,
        fullName: data.fullName,
      });
      await userRepo.save(user);

      const passwordHash = await hashPassword(data.password);

      const identity = identityRepo.create({
        userId: user.id,
        provider: 'local',
        providerId: data.email,
        passwordHash,
      });
      await identityRepo.save(identity);

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
