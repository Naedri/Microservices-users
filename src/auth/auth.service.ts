import {
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Role } from '@prisma/client';
import { TokenWrapEntity } from './entities/token-wrap.entity';
import { TokenContentEntity } from './entities/token-content.entity';
import { UserNotAuthEntity } from 'src/users/entities/user-auth.entity';
import { ConfigService } from '@nestjs/config';

// purposes : retrieving an user and verifying the password
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async login(email: string, pwd: string): Promise<TokenWrapEntity> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPwdValid = await compare(pwd, user.password);
    if (!isPwdValid) {
      throw new UnauthorizedException('Invalid password');
    }

    //we choose a property name of sub to hold our userId value to be consistent with JWT standards
    const accessTokenContent: TokenContentEntity = {
      sub: user.id,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(accessTokenContent);

    this.logger.log(
      `User with id : ${user.id} and email: ${email} has just logged.`,
    );
    return { accessToken };
  }

  async register(email: string, pwd: string): Promise<UserNotAuthEntity> {
    const emailExists = await this.userService.getByEmail(email);
    if (emailExists) {
      throw new NotAcceptableException('Email already exists');
    }
    if (!this.checkPassword(pwd)) {
      throw new NotAcceptableException('Password length incorrect');
    }

    const rounds = this.configService.get<string>('HASH_ROUND');
    const hashedPwd = await hash(pwd, parseInt(rounds));

    const user = await this.userService.create({
      email: email,
      password: hashedPwd,
      role: Role.CLIENT,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    this.logger.log(
      `User with id : ${user.id} and email: ${user.email} has just registered.`,
    );
    return result;
  }

  async validateUser(id: number, role: Role): Promise<UserNotAuthEntity> {
    const user = await this.userService.getById(id);
    if (user.role !== role) {
      throw new UnauthorizedException(
        `User with id : ${user.id} used a token with an outdated role, it was : ${role} instead of ${user.role}.`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  checkPassword(pwd: string): boolean {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    const isStrong = regex.test(pwd);
    if (!isStrong) {
      this.logger.warn(
        'Password should contain at least one number and one special character, and between 8 and 16 characters.',
      );
    }
    // TODO activate when in prod
    // return isStrong;
    return true;
  }
}