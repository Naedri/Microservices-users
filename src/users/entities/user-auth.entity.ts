import { Role, User } from '@prisma/client';
import { Auth } from 'src/auth/entities/auth.entity';

type IUserAuth = Omit<User, 'password'>; // User without password

export class UserAuth implements IUserAuth, Auth {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string;
}

export class UserNotAuth implements IUserAuth {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
