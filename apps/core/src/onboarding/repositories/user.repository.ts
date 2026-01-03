import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, EntityManager} from 'typeorm';
import {UserEntity} from '../../entities';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(data: Partial<UserEntity>, manager?: EntityManager): Promise<UserEntity> {
    const repo = manager ? manager.getRepository(UserEntity) : this.repository;
    const user = repo.create(data);
    return repo.save(user);
  }
}
