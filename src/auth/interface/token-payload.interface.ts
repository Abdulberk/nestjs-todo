import { Role } from 'src/auth/guards/role.guard';
export interface TokenPayload {
  email: string;
  sub: number | string;
  role: Role;
  iat?: number;
  exp?: number;
}
