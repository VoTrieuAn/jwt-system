import { Exclude } from 'class-transformer';

export class UserVo {
  @Exclude() password: string;

  constructor(partial: Partial<UserVo>) {
    Object.assign(this, partial);
  }
}
