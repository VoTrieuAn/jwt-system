import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './users.service';
import { AccessTokenGuard } from 'src/share/guards/access-token.guard';
import { ApiKeyGuard } from 'src/share/guards/api-key.guard';
import { UserVo } from './vo/users.vo';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SerializeOptions({ type: UserVo })
  @UseGuards(ApiKeyGuard)
  @UseGuards(AccessTokenGuard)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @SerializeOptions({ type: UserVo })
  @UseGuards(ApiKeyGuard)
  @UseGuards(AccessTokenGuard)
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
}
