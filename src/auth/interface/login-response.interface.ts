import { User } from 'src/user/entities/user.entity';

export interface LoginResponse {
  user: Partial<User>;
  accessToken: string;
  refreshToken: string;
}
