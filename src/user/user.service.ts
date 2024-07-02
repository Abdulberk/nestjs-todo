import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { Role } from 'src/auth/guards/role.guard';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { UserRepositoryInterface } from './interface/user.interface';
@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private userRepository: UserRepositoryInterface,
  ) {}

  async create(createUserDto: RegisterDto): Promise<Partial<User>> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
      if (user) {
        throw new ConflictException('User already exists');
      }
      const rounds = 10;
      const salt = bcrypt.genSaltSync(rounds);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

 
  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findByCondition({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneById(id);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const userToDelete = await this.userRepository.findOneById(id);
      if (!userToDelete) {
        throw new NotFoundException('User not found');
      }
      await this.userRepository.remover(userToDelete);
      return { message: 'User deleted' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async changeUserRole(userId: string, role: Role): Promise<User> {
    try {
      const user = await this.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.role = role;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
