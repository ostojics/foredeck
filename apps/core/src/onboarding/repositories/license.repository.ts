import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, EntityManager} from 'typeorm';
import {LicenseEntity} from '../../entities';

@Injectable()
export class LicenseRepository {
  constructor(
    @InjectRepository(LicenseEntity)
    private readonly repository: Repository<LicenseEntity>,
  ) {}

  async findByLicenseKey(licenseKey: string, manager?: EntityManager): Promise<LicenseEntity | null> {
    const repo = manager ? manager.getRepository(LicenseEntity) : this.repository;
    return repo.findOne({where: {licenseKey}});
  }
}
