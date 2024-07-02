import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/entities/user.entity';
import { TokenPayload } from './interface/token-payload.interface';
import { LoginResponse } from './interface/login-response.interface';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createAuthDto: RegisterDto) {
    return this.userService.create(createAuthDto);
  }

  async login(loginAuthDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginAuthDto);
    const payload: TokenPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES'),
      secret: this.configService.get('JWT_SECRET'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return {
      user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async validateUser(loginAuthDto: LoginDto) {
    const userExists = await this.userService.findByEmail(loginAuthDto.email);

    if (!userExists) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const comparePassword = await bcrypt.compare(
      loginAuthDto.password,
      userExists.password,
    );
    if (userExists && comparePassword) {
      const { password, ...result } = userExists;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { email: user.email, sub: user.id, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES'),
      secret: this.configService.get('JWT_SECRET'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return { accessToken, refreshToken };
  }
}
