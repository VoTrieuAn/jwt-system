import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';
import { ApiKeyGuard } from './api-key.guard';
import { AuthGuardPayloadType, AuthKind, ConditionGuard } from '../constants/auth.constant';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthKind.Bearer]: this.accessTokenGuard,
      [AuthKind.APIKey]: this.apiKeyGuard,
      [AuthKind.None]: { canActivate: () => true }, // Guard trả về true cho loại None
    };
  }

  async canActivate(context: ExecutionContext) {
    // Lấy metadata từ decorator @Auth, ưu tiên lấy từ handler trước, nếu không có thì lấy từ class
    const authGuardValue = this.reflector.getAllAndOverride<AuthGuardPayloadType | undefined>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AuthKind.None], condition: ConditionGuard.And };

    // Nếu không có metadata nào được chỉ định, cho phép truy cập
    if (!authGuardValue) return true;

    const guards = authGuardValue.authTypes
      .map((type: string) => this.authTypeGuardMap[type])
      // Lọc ra các instance guard (AccessTokenGuard | ApiKeyGuard) không hợp lệ (ví dụ: nếu có loại auth không được định nghĩa trong authTypeGuardMap)
      .filter(Boolean);

    // Nếu không có guard nào được chỉ định, cho phép truy cập vì không có điều kiện nào để kiểm tra
    if (!guards.length) return true;

    return authGuardValue.condition === ConditionGuard.And
      ? this.evaluateAndCondition(guards, context)
      : this.evaluateOrCondition(guards, context);
  }

  private async evaluateAndCondition(guards: CanActivate[], context: ExecutionContext): Promise<boolean> {
    // Trong điều kiện AND, tất cả các guard phải trả về true. Nếu bất kỳ guard nào trả về false hoặc ném lỗi, sẽ ném lỗi ngay lập tức.
    for (const guard of guards) {
      await guard.canActivate(context);
      console.log({ context });
      console.log('Đây là: ', await guard.canActivate(context));
    }

    return true;
  }

  private async evaluateOrCondition(guards: CanActivate[], context: ExecutionContext): Promise<boolean> {
    let error = new UnauthorizedException('Authentication failed');

    // Trong điều kiện OR, chỉ cần một guard trả về true là đủ. Nếu tất cả các guard đều trả về false hoặc ném lỗi, sẽ ném lỗi sau khi kiểm tra tất cả.
    for (const guard of guards) {
      try {
        const canActivate = await guard.canActivate(context);
        if (canActivate) return true;
      } catch (err) {
        if (err instanceof UnauthorizedException) {
          error = err;
        }
      }
    }

    throw error;
  }
}
