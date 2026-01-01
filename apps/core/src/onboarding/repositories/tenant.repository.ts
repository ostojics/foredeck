import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, EntityManager} from 'typeorm';
import {TenantEntity} from '../../entities';

@Injectable()
export class TenantRepository {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly repository: Repository<TenantEntity>,
  ) {}

  async findByLicenseId(licenseId: string, manager?: EntityManager): Promise<TenantEntity | null> {
    const repo = manager ? manager.getRepository(TenantEntity) : this.repository;
    return repo.findOne({where: {licenseId}});
  }

  async create(data: Partial<TenantEntity>, manager?: EntityManager): Promise<TenantEntity> {
    const repo = manager ? manager.getRepository(TenantEntity) : this.repository;
    const tenant = repo.create(data);
    return repo.save(tenant);
  }
}
