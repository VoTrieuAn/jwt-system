import { IsString } from 'class-validator';
import { LoginDto } from './login.dto';
import { Match } from 'src/share/decorators/match.decorator';
export class RegisterDto extends LoginDto {
  @IsString({ message: 'Name is not valid' })
  name: string;

  @IsString({ message: 'Confirm password is not valid' })
  @Match('password', { message: 'Confirm password does not match password' })
  confirmPassword: string;
}
