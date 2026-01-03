import {Test, TestingModule} from '@nestjs/testing';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JwtAuthGuard} from '../common/guards/jwt-auth.guard';
import {NotFoundException} from '@nestjs/common';
import type {UserDTO} from '@acme/contracts';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({canActivate: () => true})
      .compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  describe('getMe', () => {
    it('should return user data when user exists', async () => {
      const mockUser: UserDTO = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        fullName: 'Test User',
        tenant: {
          name: 'Test Company',
        },
      };

      const mockJwtPayload = {
        sub: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        tenantId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockAuthService.getUserById.mockResolvedValue(mockUser);

      const result = await authController.getMe(mockJwtPayload);

      expect(result).toEqual(mockUser);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.getUserById).toHaveBeenCalledWith(mockJwtPayload.sub);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const mockJwtPayload = {
        sub: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        tenantId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockAuthService.getUserById.mockRejectedValue(new NotFoundException('User not found'));

      await expect(authController.getMe(mockJwtPayload)).rejects.toThrow(NotFoundException);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.getUserById).toHaveBeenCalledWith(mockJwtPayload.sub);
    });
  });
});
