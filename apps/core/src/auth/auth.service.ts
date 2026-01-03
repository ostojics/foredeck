import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserIdentityEntity} from '../entities/user-identity.entity';
import {UserEntity} from '../entities/user.entity';
import {JwtService} from './jwt.service';
import {Response} from 'express';
import {verifyPassword} from 'src/lib/hashing/hashing';
import type {MeResponseDTO} from '@acme/contracts';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserIdentityEntity)
    private readonly userIdentityRepository: Repository<UserIdentityEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  async getMe(userId: string): Promise<MeResponseDTO> {
    const user = await this.userRepository.findOne({
      where: {id: userId},
      relations: ['tenant'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
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
