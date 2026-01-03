import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserIdentity} from '../common/entities/user-identity.entity';
import {JwtService} from './jwt.service';
import {Response} from 'express';
import {verifyPassword} from 'src/lib/hashing/hashing';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserIdentity)
    private readonly userIdentityRepository: Repository<UserIdentity>,
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
}
