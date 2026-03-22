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
import { UseAuthGuard } from 'src/share/decorators/auth.decorator';
import { AuthKind } from 'src/share/constants/auth.constant';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SerializeOptions({ type: UserVo })
  // @UseGuards(ApiKeyGuard)
  // @UseGuards(AccessTokenGuard)
  @UseAuthGuard([AuthKind.Bearer, AuthKind.APIKey], { condition: 'AND' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @SerializeOptions({ type: UserVo })
  // @UseGuards(ApiKeyGuard)
  // @UseGuards(AccessTokenGuard)
  @UseAuthGuard([AuthKind.Bearer, AuthKind.APIKey], { condition: 'AND' })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
}
