import { SetMetadata } from '@nestjs/common';
import { AuthType, ConditionGuard, ConditionGuardType } from '../constants/auth.constant';

export const AUTH_TYPE_KEY = 'authType';

export const UseAuthGuard = (authTypes: AuthType[], options?: { condition: ConditionGuardType }) =>
  SetMetadata(AUTH_TYPE_KEY, {
    authTypes,
    condition: options?.condition || ConditionGuard.And,
  });
