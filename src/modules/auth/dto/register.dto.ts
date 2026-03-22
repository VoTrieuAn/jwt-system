import { LoginDto } from './login.dto';
export class RegisterDto extends LoginDto {
  confirmPassword: string;
  name: string;
}
