import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserIdentity} from '../common/entities/user-identity.entity';
import {PasswordHasher} from '../common/utils/password-hasher';
import {JwtService} from './jwt.service';
import {Response} from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserIdentity)
    private readonly userIdentityRepository: Repository<UserIdentity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string, res: Response): Promise<void> {
    const identity = await this.userIdentityRepository.findOne({
      where: {
        provider: 'local',
        providerId: username,
      },
      relations: ['user'],
    });

    if (!identity || !identity.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await PasswordHasher.verify(identity.passwordHash, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.generateToken(identity.user.id, identity.user.email, identity.user.tenantId);

    this.jwtService.setTokenCookie(res, token);
  }
}
