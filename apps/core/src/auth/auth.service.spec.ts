import {Test, TestingModule} from '@nestjs/testing';
import {UnauthorizedException} from '@nestjs/common';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {AuthService} from './auth.service';
import {JwtService} from './jwt.service';
import {UserIdentity} from '../common/entities/user-identity.entity';
import {User} from '../common/entities/user.entity';
import {PasswordHasher} from '../common/utils/password-hasher';
import {Response} from 'express';

jest.mock('../common/utils/password-hasher');

describe('AuthService', () => {
  let service: AuthService;
  let userIdentityRepository: Repository<UserIdentity>;
  let jwtService: JwtService;

  const mockUser: User = {
    id: 'user-id',
    tenantId: 'tenant-id',
    email: 'test@example.com',
    fullName: 'Test User',
    identity: null,
  };

  const mockUserIdentity: UserIdentity = {
    id: 'identity-id',
    userId: 'user-id',
    provider: 'local',
    providerId: 'test@example.com',
    passwordHash: '$argon2id$hashedpassword',
    user: mockUser,
  };

  const mockResponse = {
    cookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserIdentity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            generateToken: jest.fn(),
            setTokenCookie: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userIdentityRepository = module.get<Repository<UserIdentity>>(getRepositoryToken(UserIdentity));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const username = 'test@example.com';
      const password = 'password123';
      const token = 'jwt-token';

      jest.spyOn(userIdentityRepository, 'findOne').mockResolvedValue(mockUserIdentity);
      (PasswordHasher.verify as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'generateToken').mockResolvedValue(token);

      await service.login(username, password, mockResponse);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userIdentityRepository.findOne).toHaveBeenCalledWith({
        where: {
          provider: 'local',
          providerId: username,
        },
        relations: ['user'],
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(PasswordHasher.verify).toHaveBeenCalledWith(mockUserIdentity.passwordHash, password);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.generateToken).toHaveBeenCalledWith(mockUser.id, mockUser.email, mockUser.tenantId);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.setTokenCookie).toHaveBeenCalledWith(mockResponse, token);
    });

    it('should throw UnauthorizedException when user identity not found', async () => {
      const username = 'nonexistent@example.com';
      const password = 'password123';

      jest.spyOn(userIdentityRepository, 'findOne').mockResolvedValue(null);

      await expect(service.login(username, password, mockResponse)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(username, password, mockResponse)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException when password hash is null', async () => {
      const username = 'test@example.com';
      const password = 'password123';
      const identityWithoutHash = {...mockUserIdentity, passwordHash: null};

      jest.spyOn(userIdentityRepository, 'findOne').mockResolvedValue(identityWithoutHash);

      await expect(service.login(username, password, mockResponse)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(username, password, mockResponse)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const username = 'test@example.com';
      const password = 'wrongpassword';

      jest.spyOn(userIdentityRepository, 'findOne').mockResolvedValue(mockUserIdentity);
      (PasswordHasher.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.login(username, password, mockResponse)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(username, password, mockResponse)).rejects.toThrow('Invalid credentials');
    });
  });
});
