import type { VerificationPayload } from './types';

export const verificationApi = {
  submitVerification: async (data: VerificationPayload): Promise<void> => {
    console.log('Verification submitted (dummy):', data);
  },
};
