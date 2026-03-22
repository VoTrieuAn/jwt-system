import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/share/services/prisma.service';
import { HashingService } from 'src/share/services/hashing.service';
import { RegisterVo } from './vo/register.vo';
import { TokenService } from 'src/share/services/token.service';
import { LoginDto } from './dto/login.dto';
import { LoginVo } from './vo/login.vo';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterVo> {
    try {
      const { email, password, confirmPassword, name } = registerDto;

      if (password !== confirmPassword) {
        throw new BadRequestException('Password and confirm password do not match');
      }

      const userExists = await this.prismaService.user.findFirst({ where: { email } });

      if (userExists) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await this.hashingService.hashPassword(password);

      const user = await this.prismaService.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const tokens = await this.tokenService.generateTokens({
        userId: user.id,
      });

      return new RegisterVo({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        message: 'User registered successfully',
        tokens,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginVo> {
    try {
      const { email, password } = loginDto;

      const userExists = await this.prismaService.user.findFirst({ where: { email } });

      if (!userExists) {
        throw new BadRequestException('Invalid email or password');
      }

      const isValidPassword = await this.hashingService.comparePassword(password, userExists.password);

      if (!isValidPassword) {
        throw new BadRequestException('Invalid email or password');
      }

      const tokens = await this.tokenService.generateTokens({
        userId: userExists.id,
      });

      return new LoginVo({
        data: {
          id: userExists.id,
          email: userExists.email,
          name: userExists.name,
        },
        message: 'Login successful',
        tokens,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid email or password');
    }
  }
}
