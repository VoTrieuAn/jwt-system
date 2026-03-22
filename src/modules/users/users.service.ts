import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/share/services/prisma.service';
import { UserVo } from './vo/users.vo';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(): Promise<UserVo[]> {
    const users = await this.prismaService.user.findMany();
    return users.map((user) => new UserVo(user));
  }
  // {
  //           id: user.id,
  //           email: user.email,
  //           name: user.name,
  //           createdAt: user.createdAt,
  //           updatedAt: user.updatedAt,
  //         }
  async findOne(id: string): Promise<UserVo> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    return new UserVo(user ?? {});
  }
}
