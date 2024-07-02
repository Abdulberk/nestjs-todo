import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponse } from './interface/login-response.interface';
import { User } from 'src/user/entities/user.entity';
import { Role } from './guards/role.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({} as Partial<User>),
            login: jest.fn().mockResolvedValue({} as LoginResponse),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register with the correct parameters', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      await authController.register(registerDto);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should return the result from AuthService.register', async () => {
      const result: Partial<User> = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };
      jest.spyOn(authService, 'register').mockResolvedValue(result);
      expect(await authController.register({} as RegisterDto)).toBe(result);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with the correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      await authController.login(loginDto);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should return the result from AuthService.login', async () => {
      const result: LoginResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashedpassword',
          role: Role.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      jest.spyOn(authService, 'login').mockResolvedValue(result);
      expect(await authController.login({} as LoginDto)).toBe(result);
    });
  });
});
