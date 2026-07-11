import { client } from '../../../utils/apiClient';
import { HoldStatus } from './types';

export const paymentApi = {
  getHoldStatus: (confirmationId: string): Promise<HoldStatus> =>
    client
      .get(`/api/v1/payments/hold/${confirmationId}`)
      .then((r) => r.data),
};
