import {Injectable, UnauthorizedException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserIdentity} from '../common/entities/user-identity.entity';
import {UserEntity} from '../entities/user.entity';
import {JwtService} from './jwt.service';
import {Response} from 'express';
import {verifyPassword} from 'src/lib/hashing/hashing';
import {UserDTO} from '@acme/contracts';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserIdentity)
    private readonly userIdentityRepository: Repository<UserIdentity>,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string, res: Response): Promise<void> {
    const identity = await this.userIdentityRepository.findOne({
      where: {
        provider: 'local',
        providerId: email,
      },
      relations: ['user'],
    });

    if (!identity || !identity.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await verifyPassword(password, identity.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.generateToken(identity.user.id, identity.user.email, identity.user.tenantId);

    this.jwtService.setTokenCookie(res, token);
  }

  async getUserById(userId: string): Promise<UserDTO> {
    const user = await this.userEntityRepository.findOne({
      where: {id: userId},
      relations: ['tenant'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      tenant: {
        name: user.tenant.name,
      },
    };
  }
}
