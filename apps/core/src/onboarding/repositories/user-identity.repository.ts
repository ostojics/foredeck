import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, EntityManager} from 'typeorm';
import {UserIdentityEntity} from '../../entities';

@Injectable()
export class UserIdentityRepository {
  constructor(
    @InjectRepository(UserIdentityEntity)
    private readonly repository: Repository<UserIdentityEntity>,
  ) {}

  async findByProviderAndProviderId(
    provider: string,
    providerId: string,
    manager?: EntityManager,
  ): Promise<UserIdentityEntity | null> {
    const repo = manager ? manager.getRepository(UserIdentityEntity) : this.repository;
    return repo.findOne({where: {provider, providerId}});
  }

  async create(data: Partial<UserIdentityEntity>, manager?: EntityManager): Promise<UserIdentityEntity> {
    const repo = manager ? manager.getRepository(UserIdentityEntity) : this.repository;
    const identity = repo.create(data);
    return repo.save(identity);
  }
}
