import { Role } from '@prisma/client';

export class TokenContentEntity {
  tokenUuid: string;
  sub: number;
  role: Role;
}
