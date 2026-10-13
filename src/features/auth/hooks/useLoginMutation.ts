import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { AuthUser, LoginPayload } from '@/domain/entities/Usuario';

export function useLoginMutation() {
  return useMutation<AuthUser, Error, LoginPayload>({
    mutationFn: (payload) => authService.login(payload),
  });
}
