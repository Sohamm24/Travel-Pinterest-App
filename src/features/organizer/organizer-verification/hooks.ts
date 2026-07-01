import { useMutation } from '@tanstack/react-query';
import { verificationApi } from './api';
import type { VerificationPayload } from './types';

export function useSubmitVerification() {
  return useMutation({
    mutationFn: (data: VerificationPayload) => verificationApi.submitVerification(data),
  });
}
