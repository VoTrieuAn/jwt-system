import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  private readonly SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
    return hashPassword;
  }

  async comparePassword(password: string, hashPassword: string) {
    const isMatch = await bcrypt.compare(password, hashPassword);
    return isMatch;
  }
}
