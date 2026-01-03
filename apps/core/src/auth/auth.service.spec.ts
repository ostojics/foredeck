import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserIdentity} from '../common/entities/user-identity.entity';
import {User} from '../common/entities/user.entity';
import {UserEntity} from '../entities/user.entity';
import {JwtService} from './jwt.service';
import {NotFoundException} from '@nestjs/common';
import type {UserDTO} from '@acme/contracts';

describe('AuthService', () => {
  let authService: AuthService;
  let userEntityRepository: Repository<UserEntity>;

  const mockUserIdentityRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockUserEntityRepository = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    generateToken: jest.fn(),
    setTokenCookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserIdentity),
          useValue: mockUserIdentityRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserEntityRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userEntityRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  describe('getUserById', () => {
    it('should return user data when user exists', async () => {
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        fullName: 'Test User',
        tenantId: '456e4567-e89b-12d3-a456-426614174000',
        tenant: {
          id: '456e4567-e89b-12d3-a456-426614174000',
          name: 'Test Company',
          slug: 'test-company',
          licenseId: '789e4567-e89b-12d3-a456-426614174000',
          url: 'https://test.com',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          license: null as any,

          users: [],
        },
        identity: null as any, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      };

      mockUserEntityRepository.findOne.mockResolvedValue(mockUser);

      const result: UserDTO = await authService.getUserById('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual({
        userId: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
        tenant: {
          name: mockUser.tenant.name,
        },
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userEntityRepository.findOne).toHaveBeenCalledWith({
        where: {id: '123e4567-e89b-12d3-a456-426614174000'},
        relations: ['tenant'],
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserEntityRepository.findOne.mockResolvedValue(null);

      await expect(authService.getUserById('123e4567-e89b-12d3-a456-426614174000')).rejects.toThrow(NotFoundException);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userEntityRepository.findOne).toHaveBeenCalledWith({
        where: {id: '123e4567-e89b-12d3-a456-426614174000'},
        relations: ['tenant'],
      });
    });
  });
});
