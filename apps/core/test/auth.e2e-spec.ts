import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import request from 'supertest';
import {App} from 'supertest/types';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {AuthModule} from '../src/auth/auth.module';
import {UserIdentity} from '../src/common/entities/user-identity.entity';
import {User} from '../src/common/entities/user.entity';
import {ConfigModule} from '@nestjs/config';
import {appConfig} from '../src/config/app.config';
import {jwtConfig} from '../src/config/jwt.config';
import {PasswordHasher} from '../src/common/utils/password-hasher';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let userIdentityRepository: Repository<UserIdentity>;

  const mockUser: User = {
    id: 'user-id',
    tenantId: 'tenant-id',
    email: 'test@example.com',
    fullName: 'Test User',
    identity: null,
  };

  let mockUserIdentity: UserIdentity;

  beforeAll(async () => {
    const hashedPassword = await PasswordHasher.hash('password123');
    mockUserIdentity = {
      id: 'identity-id',
      userId: 'user-id',
      provider: 'local',
      providerId: 'test@example.com',
      passwordHash: hashedPassword,
      user: mockUser,
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig, jwtConfig],
        }),
        AuthModule,
      ],
    })
      .overrideProvider(getRepositoryToken(UserIdentity))
      .useValue({
        findOne: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userIdentityRepository = moduleFixture.get<Repository<UserIdentity>>(getRepositoryToken(UserIdentity));
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /v1/auth/login', () => {
    it('should successfully login with valid credentials', async () => {
      jest.spyOn(userIdentityRepository, 'findOne').mockResolvedValue(mockUserIdentity);

      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          username: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toEqual({message: 'Login successful'});
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('access_token=');
    });

    it('should return 401 for invalid credentials', async () => {
      jest.spyOn(userIdentityRepository, 'findOne').mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          username: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);
    });

    it('should return 401 for incorrect password', async () => {
      jest.spyOn(userIdentityRepository, 'findOne').mockResolvedValue(mockUserIdentity);

      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          username: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should return 400 for missing username', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          password: 'password123',
        })
        .expect(400);
    });

    it('should return 400 for missing password', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          username: 'test@example.com',
        })
        .expect(400);
    });

    it('should return 400 for empty username', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          username: '',
          password: 'password123',
        })
        .expect(400);
    });

    it('should return 400 for empty password', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          username: 'test@example.com',
          password: '',
        })
        .expect(400);
    });
  });
});
