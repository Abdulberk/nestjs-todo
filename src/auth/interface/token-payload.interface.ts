import { Role } from 'src/auth/guards/role.guard';
export interface TokenPayload {
  email: string;
  sub: number;
  role: Role;
}
